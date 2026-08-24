import React, { useState, useEffect } from 'react';
import {
  Coins,
  Gift,
  CheckCircle2,
  Lock,
  Download,
  Sparkles,
  Award,
  Zap,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  Flame,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { studentAPI } from '../../services/api';

const STORE_ITEMS = [
  {
    id: 'note-physics-ch4',
    titleBn: 'মো: আলমগীর হোসেন (সাগর) স্যারের স্পেশাল পদার্থবিজ্ঞান হ্যান্ডনোট',
    titleEn: 'Physics Hand-written Master Notes',
    category: 'SPECIAL_NOTES',
    price: 50,
    icon: BookOpen,
    badge: 'সেরা বিক্রিত',
    color: 'from-blue-600 to-indigo-600',
    description: 'কাজ, ক্ষমতা ও শক্তি এবং বলবিদ্যার সকল বোর্ড প্রশ্ন ও গাণিতিক সূত্রের হাতে লেখা রঙিন লেকচার শিট।',
    downloadUrl: '#download-physics-notes'
  },
  {
    id: 'model-test-ssc-26',
    titleBn: 'SSC ২০২৬ স্পেশাল চূড়ান্ত মডেল টেস্ট প্রশ্ন ও সমাধান',
    titleEn: 'SSC 2026 Premium Model Test Papers',
    category: 'MODEL_TESTS',
    price: 80,
    icon: Award,
    badge: 'প্রিমিয়াম',
    color: 'from-amber-600 to-orange-600',
    description: 'শীর্ষ শিক্ষাপ্রতিষ্ঠানের অভিজ্ঞ শিক্ষকদের তৈরি ১০০% কমন উপযোগী পূর্ণাঙ্গ প্রশ্নপত্র ও বিস্তারিত উত্তরমালা।',
    downloadUrl: '#download-model-test'
  },
  {
    id: 'ai-booster-pack',
    titleBn: '২৪/৭ এআই ডাউট সলভার আনলিমিটেড বুস্টার প্যাক',
    titleEn: '24/7 AI Doubt Solver Unlimited Booster',
    category: 'BOOSTER',
    price: 30,
    icon: Zap,
    badge: 'পাওয়ার আপ',
    color: 'from-emerald-600 to-teal-600',
    description: 'যেকোনো কঠিন গণিত বা বিজ্ঞানের প্রশ্নের তাৎক্ষণিক ফটো স্ক্যান ও AI সলিউশনের আনলিমিটেড অ্যাক্সেস।'
  },
  {
    id: 'vip-student-badge',
    titleBn: 'VIP গোল্ডেন স্টুডেন্ট ব্যাজ ও প্রোফাইল ফ্রেম',
    titleEn: 'VIP Golden Student Avatar Frame',
    category: 'AVATAR',
    price: 100,
    icon: Sparkles,
    badge: 'এক্সক্লুসিভ',
    color: 'from-purple-600 to-pink-600',
    description: 'লিডারবোর্ড এবং স্টুডেন্ট প্রোফাইলে জ্বলজ্বলে গোল্ডেন ব্যাজ ও স্পেশাল অ্যানিমেটেড ফ্রেম।'
  },
  {
    id: 'math-shortcut-booklet',
    titleBn: 'উচ্চতর গণিত শর্টকাট টেকনিক ও ফর্মুলা বুকলেট',
    titleEn: 'Higher Math Shortcut Formula Booklet',
    category: 'SPECIAL_NOTES',
    price: 40,
    icon: BookOpen,
    badge: 'জনপ্রিয়',
    color: 'from-rose-600 to-red-600',
    description: 'ত্রিকোণমিতি ও স্থানাঙ্ক জ্যামিতির নৈর্ব্যক্তিক প্রশ্ন ২০ সেকেন্ডে সমাধানের জাদুকরী টেকনিক।'
  }
];

export default function NextGenRewardStore({ onCoinBalanceChange }) {
  const [coins, setCoins] = useState(150);
  const [canClaimDaily, setCanClaimDaily] = useState(true);
  const [unlockedRewards, setUnlockedRewards] = useState(['note-physics-ch4']);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchCoinsData();
  }, []);

  const fetchCoinsData = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getCoins();
      if (res?.success && res.data) {
        setCoins(res.data.coins);
        setCanClaimDaily(res.data.canClaimDaily);
        setUnlockedRewards(res.data.unlockedRewards || []);
        if (onCoinBalanceChange) onCoinBalanceChange(res.data.coins);
      }
    } catch (err) {
      console.error('Failed to fetch coin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDaily = async () => {
    try {
      setClaiming(true);
      const res = await studentAPI.claimDailyCoins();
      if (res?.success) {
        setCoins(res.data.coins);
        setCanClaimDaily(false);
        if (onCoinBalanceChange) onCoinBalanceChange(res.data.coins);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setFeedback({ type: 'success', message: 'অভিনন্দন! আপনি দৈনিক লগইন বোনাস হিসেবে +১০ কয়েন পেয়েছেন! 🪙' });
      } else {
        setFeedback({ type: 'error', message: res.error?.message || 'ক্লেইম করা সম্ভব হয়নি।' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'নেটওয়ার্ক সমস্যা।' });
    } finally {
      setClaiming(false);
    }
  };

  const handleBuyItem = async (item) => {
    try {
      setBuyingId(item.id);
      const res = await studentAPI.buyReward({
        itemId: item.id,
        price: item.price,
        itemTitle: item.titleBn
      });

      if (res?.success) {
        setCoins(res.data.coins);
        setUnlockedRewards(res.data.unlockedRewards);
        setConfirmItem(null);
        if (onCoinBalanceChange) onCoinBalanceChange(res.data.coins);
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
        setFeedback({ type: 'success', message: `🎉 "${item.titleBn}" সফলভাবে আনলক হয়েছে!` });
      } else {
        setFeedback({ type: 'error', message: res?.error?.message || 'কয়েন পর্যাপ্ত নয়।' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'ক্রয় ব্যর্থ হয়েছে।' });
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      {/* Top Banner with Glowing Coin Balance & Daily Claim */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900/40 border border-amber-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 ring-4 ring-amber-400/20 animate-bounce">
              🪙
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                NextGen Gamification Engine
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                রিওয়ার্ড স্টোর ও কয়েন ভল্ট
              </h1>
              <p className="text-xs text-amber-200/80 mt-1">
                পড়ালেখা, কুইজ ও দৈনিক উপস্থিতির মাধ্যমে কয়েন অর্জন করুন এবং এক্সক্লুসিভ স্টাডি ম্যাটেরিয়াল আনলক করুন!
              </p>
            </div>
          </div>

          {/* Current Coin Balance & Daily Claim Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="px-6 py-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 backdrop-blur-md text-center shadow-lg w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-400">আপনার বর্তমান কয়েন:</span>
              <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1.5 mt-0.5">
                <span>🪙</span>
                <span>{coins}</span>
                <span className="text-xs text-amber-200">কয়েন</span>
              </div>
            </div>

            <button
              onClick={handleClaimDaily}
              disabled={!canClaimDaily || claiming}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
                canClaimDaily
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 transform hover:scale-105 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {claiming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : canClaimDaily ? (
                <>
                  <Gift className="w-5 h-5" />
                  দৈনিক ১০ কয়েন ক্লেইম করুন!
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  আজকের বোনাস গৃহীত (+১০ 🪙)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reward Store Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            ডিজিটাল রিওয়ার্ড ক্যাটালগ
          </h3>
          <span className="text-xs text-slate-400 font-bold">
            আনলক হয়েছে: {unlockedRewards.length}টি অ্যাসেট
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORE_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const isUnlocked = unlockedRewards.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all duration-300 shadow-xl relative overflow-hidden"
              >
                <div>
                  {/* Card Header & Price Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <ItemIcon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-slate-950 text-amber-400 text-xs font-black border border-slate-800 flex items-center gap-1 font-mono">
                        🪙 {item.price}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-white mt-4 leading-snug">
                    {item.titleBn}
                  </h4>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Purchase / Unlocked Action */}
                <div className="pt-3 border-t border-slate-800">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> আনলক করা হয়েছে
                      </span>

                      {item.downloadUrl && (
                        <button
                          onClick={() => {
                            confetti({ particleCount: 30, spread: 60 });
                            alert(`"${item.titleBn}" সফলভাবে ডাউনলোড শুরু হয়েছে!`);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" /> ডাউনলোড
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmItem(item)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          {item.price} কয়েনে আনলক করুন
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          কয়েন প্রয়োজন ({item.price - coins} কয়েন বাকি)
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-2">
                🪙 কয়েন দিয়ে আনলক নিশ্চিত করুন
              </h4>
              <button onClick={() => setConfirmItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-extrabold text-amber-400 text-sm">{confirmItem.titleBn}</p>
              <p className="text-xs text-slate-400">{confirmItem.description}</p>
              <div className="flex items-center justify-between pt-2 text-xs font-bold">
                <span className="text-slate-300">মূল্য: 🪙 {confirmItem.price} কয়েন</span>
                <span className="text-slate-400">বর্তমান ব্যালেন্স: {coins} কয়েন</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmItem(null)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleBuyItem(confirmItem)}
                disabled={buyingId === confirmItem.id}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {buyingId === confirmItem.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'হ্যাঁ, আনলক করুন'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
