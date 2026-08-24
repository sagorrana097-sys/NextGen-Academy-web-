import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Brain, 
  FlaskConical, Heart, Calculator, Compass, BookOpen, 
  CheckCircle2, Users, Trophy, Award, Phone, MapPin, 
  UserCheck, Layers, Rocket, Star, PlayCircle
} from 'lucide-react';

export default function LandingPage({ onNavigateLogin, onNavigateAdmission, onExploreLab }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                NextGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Academy</span>
              </h1>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">LEARN · GROW · SUCCEED</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">ফিচারসমূহ</a>
            <a href="#labs" className="hover:text-cyan-400 transition-colors">স্মার্ট ৩ডি ল্যাব</a>
            <a href="#director" className="hover:text-cyan-400 transition-colors">পরিচালক বার্তা</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">যোগাযোগ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              পোর্টাল লগইন
            </button>
            <button
              onClick={onNavigateAdmission}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-90 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>অনলাইন ভর্তি</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 shadow-inner animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ডিজিটাল বাংলাদেশ ও আধুনিক শিক্ষা বিপ্লব</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            পড়াশোনা এখন <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500">
              গেমের মতো আনন্দদায়ক!
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            নেক্সটজেন একাডেমিতে বিজ্ঞান, গণিত ও আইসিটি মুখস্থ নয়—৩ডি সিমুলেশন, এআই রুটিন ট্র্যাকার ও ইন্টারঅ্যাক্টিভ ভার্চুয়াল ল্যাবে সরাসরি নিজে করে শেখো।
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateAdmission}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>আজই ভর্তি হও (SSC ও প্রাক-SSC)</span>
            </button>
            <button
              onClick={onNavigateLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              <span>স্টুডেন্ট / প্যারেন্ট ড্যাশবোর্ড</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { num: '১০০%', label: 'বোর্ড পাশের রেকর্ড', icon: Award, color: 'text-amber-400' },
              { num: '৭+ স্মার্ট ল্যাব', label: 'ভার্চুয়াল ৩ডি ইঞ্জিন', icon: Layers, color: 'text-cyan-400' },
              { num: '২৪/৭ এআই', label: 'সন্দেহ নিরসন ও টিউটর', icon: Brain, color: 'text-purple-400' },
              { num: 'A+ নিশ্চিত', label: 'অধ্যায়ভিত্তিক ওএমআর টেস্ট', icon: Trophy, color: 'text-emerald-400' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
                  <div className="text-xl font-black text-white">{stat.num}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Labs Grid Section */}
      <section id="labs" className="py-20 bg-slate-900/40 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-2">স্মার্ট সাবজেক্ট ল্যাব</h2>
            <p className="text-3xl sm:text-4xl font-black text-white">
              বইয়ের জটিল থিওরি চোখের সামনে জীবন্ত
            </p>
            <p className="text-slate-400 text-sm mt-3">
              পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও গণিতের বাস্তবধর্মী সিমুলেশন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'মেগা ফিজিক্স ল্যাব',
                desc: 'ভার্নিয়ার ক্যালিপার্স, গতিবিদ্যা, অপটিক্স রশ্মিচিত্র, তড়িৎ বর্তনী ও ট্রান্সফরমার সিমুলেটর।',
                icon: Zap,
                badge: 'পদার্থবিজ্ঞান',
                color: 'from-blue-600 to-cyan-600'
              },
              {
                title: 'রসায়ন মাস্টার ল্যাব',
                desc: 'বোর পরমাণু মডেল, পর্যায় সারণি প্রবণতা, রাসায়নিক বন্ধন, তড়িৎকোষ ও ব্লাস্ট ফার্নেস নিষ্কাশন।',
                icon: FlaskConical,
                badge: 'রসায়ন',
                color: 'from-emerald-600 to-teal-600'
              },
              {
                title: 'জীববিজ্ঞান ৩ডি অ্যানাটমি',
                desc: 'হৃদপিণ্ডের রক্ত সংবহন, বৃক্ক ও নেফ্রন, উদ্ভিদ/প্রাণী কোষ ও ডিএনএ ডাবল-হেলিক্স অ্যানিমেশন।',
                icon: Heart,
                badge: 'জীববিজ্ঞান',
                color: 'from-rose-600 to-pink-600'
              },
              {
                title: 'ম্যাথ ও আইসিটি ইঞ্জিন',
                desc: 'দ্বিঘাত ফাংশন গ্রাফ প্লটার, ত্রিকোণমিতি একক বৃত্ত, লজিক গেট সিমুলেটর ও কোড স্যান্ডবক্স।',
                icon: Calculator,
                badge: 'উচ্চতর গণিত ও আইসিটি',
                color: 'from-indigo-600 to-purple-600'
              },
              {
                title: 'ভার্চুয়াল জ্যামিতি বক্স',
                desc: 'স্কেল, কম্পাস, চাঁদা দিয়ে ২ডি ও ৩ডি ঘনবস্তুর নির্ভুল জ্যামিতিক অঙ্কন ক্যানভাস।',
                icon: Compass,
                badge: 'সাধারণ গণিত',
                color: 'from-amber-600 to-orange-600'
              },
              {
                title: 'এআই গ্রামার ও ওয়ার্ড অ্যানালাইজার',
                desc: 'টেন্স, ভয়েস, ন্যারেশন এবং রিয়েল-টাইম পার্টস অফ স্পিচ ও ভোকাবুলারি সার্চ ইঞ্জিন।',
                icon: BookOpen,
                badge: 'ইংরেজি গ্রামার',
                color: 'from-cyan-600 to-blue-600'
              },
            ].map((lab, i) => {
              const Icon = lab.icon;
              return (
                <div key={i} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${lab.color} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                        {lab.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {lab.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>লাইভ ইন্টারঅ্যাক্টিভ</span>
                    <button onClick={onNavigateLogin} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                      ল্যাবে প্রবেশ <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>পরবর্তী প্রজন্মের লার্নিং প্রযুক্তি</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              প্রতিটি শিক্ষার্থীর জন্য <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                ব্যক্তিগত এআই গাইডেন্স ও ট্র্যাকিং
              </span>
            </h2>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">এআই দুর্বলতা ট্র্যাকার:</strong> কোন অধ্যায়ে শিক্ষার্থীর ঘাটতি রয়েছে তা স্বয়ংক্রিয়ভাবে চিহ্নিত করে ৭ দিনের কাস্টমাইজড স্টাডি প্ল্যান তৈরি।
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">গ্যামিফাইড আরপিজি সিলেবাস জার্নি:</strong> প্রতিটি অধ্যায় একটি মিশন। লেভেল আপ, এক্সপি ও ব্যাজ অর্জনের মাধ্যমে আনন্দের সাথে সিলেবাস সমাপ্তি।
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">অভিভাবক স্বচ্ছতা পোর্টাল:</strong> উপস্থিতি, ওএমআর মডেল টেস্টের ফলাফল এবং ফি প্রদানের তাৎক্ষণিক এসএমএস ও অনলাইন রিপোর্ট কার্ড।
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onNavigateAdmission}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>ভর্তি ফরম পূরণ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">এআই স্টাডি রুটিন পারফরম্যান্স</span>
                  <span className="text-xs font-black text-emerald-400">৯৫% অগ্রগতি</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[95%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
                <p className="font-bold flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>স্মার্ট সাজেশন:</span>
                </p>
                পদার্থবিজ্ঞান "আলোর প্রতিফলন" অধ্যায়ে আরও ২টি সৃজনশীল ওএমআর সমাধান করলে নিশ্চিত A+ নিশ্চিত হবে!
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-lg font-black text-white">১২০+</div>
                  <div className="text-[10px] text-slate-400">মডেল টেস্ট সম্পন্ন</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-lg font-black text-cyan-400">৫৫+</div>
                  <div className="text-[10px] text-slate-400">ইন্টারঅ্যাক্টিভ সিমুলেশন</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Director & Contact Section */}
      <section id="director" className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 mx-auto flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-500/30">
              সা
            </div>
            <h3 className="text-2xl font-black text-white">মো: আলমগীর হোসেন (সাগর)</h3>
            <p className="text-sm font-bold text-cyan-400">পরিচালক ও প্রধান শিক্ষক · NextGen Academy</p>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed italic">
              "আমাদের লক্ষ্য শিক্ষার্থীদের গতানুগতিক মুখস্থবিদ্যা থেকে মুক্ত করে আধুনিক বিজ্ঞান ও প্রযুক্তিমনস্ক করে গড়ে তোলা। প্রতিটি শিক্ষার্থী যেন আনন্দের সাথে নিজের মেধার সর্বোচ্চ বিকাশ ঘটাতে পারে।"
            </p>
          </div>
        </div>
      </section>

      {/* Mandatory Official Footer */}
      <footer id="contact" className="bg-slate-950 border-t border-slate-800 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="text-base font-black text-white">NextGen Academy</h4>
            <p className="mt-1">পরিচালক: মো: আলমগীর হোসেন (সাগর)</p>
            <p>হেল্পলাইন: ০১৭৯২৮১৮০০৫</p>
            <p>ঠিকানা: পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর</p>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-slate-200">LEARN · GROW · SUCCEED</p>
            <p>© {new Date().getFullYear()} NextGen Academy. All rights reserved.</p>
            <p className="text-[11px] text-slate-500">ডিজিটাল একাডেমি ম্যানেজমেন্ট ও স্মার্ট লার্নিং প্ল্যাটফর্ম</p>
          </div>

          <div>
            <button
              onClick={onNavigateAdmission}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all"
            >
              ভর্তি হতে আবেদন করুন
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
