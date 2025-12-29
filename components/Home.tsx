
import React from 'react';
import { AppView } from '../types';
import { 
  MessageCircle, 
  Eye, 
  UserPlus, 
  Gamepad2, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Heart,
  Sparkles
} from 'lucide-react';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      id: AppView.ASSISTANT,
      title: "Reply Buddy",
      tag: "Ghostwriter",
      desc: "Stuck on what to say? Paste the message and get charming, high-EQ responses instantly.",
      icon: MessageCircle,
      color: "bg-indigo-500",
      shadow: "shadow-indigo-100 dark:shadow-none"
    },
    {
      id: AppView.VIBE_CHECK,
      title: "Vibe Decoder",
      tag: "Deep Context",
      desc: "Overthinking that text? We analyze the subtext and tone so you don't have to.",
      icon: Eye,
      color: "bg-emerald-500",
      shadow: "shadow-emerald-100 dark:shadow-none"
    },
    {
      id: AppView.ICEBREAKER,
      title: "Icebreakers",
      tag: "Door Opener",
      desc: "Kill the silence. Get custom, non-cringe openers for any social or professional setting.",
      icon: UserPlus,
      color: "bg-pink-500",
      shadow: "shadow-pink-100 dark:shadow-none"
    },
    {
      id: AppView.SANDBOX,
      title: "Practice Lab",
      tag: "Simulator",
      desc: "Roleplay stressful scenarios with an AI coach before the real thing. Zero embarrassment.",
      icon: Gamepad2,
      color: "bg-amber-500",
      shadow: "shadow-amber-100 dark:shadow-none"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-24 py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-200/20 blur-3xl -z-10 rounded-full dark:hidden"></div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles size={14} className="animate-pulse" /> The ultimate social cheat-sheet
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Stop social <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">burnout</span>.<br/>
          Chat with <span className="italic relative text-slate-950 dark:text-white">
            confidence
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-300 dark:text-indigo-900 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 C30,5 70,25 100,10" stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round" />
            </svg>
          </span>.
        </h1>
        <p className="text-xl text-slate-800 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Chatters.ai is your private social think-tank. Whether it's online dating, 
          professional emails, or party small talk, we use AI to help you skip the anxiety.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <button 
            onClick={() => onNavigate(AppView.ASSISTANT)}
            className="px-10 py-5 bg-indigo-600 dark:bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center gap-3 group"
          >
            Start Chatting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {features.map((f, i) => (
          <div 
            key={f.id}
            onClick={() => onNavigate(f.id)}
            className={`glass feature-card-hover group cursor-pointer p-10 rounded-[2.5rem] border-2 border-white/80 dark:border-transparent hover:border-indigo-200 dark:hover:border-slate-600 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`${f.color} p-5 rounded-3xl text-white ${f.shadow} shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <f.icon size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-slate-400 transition-colors">
                {f.tag}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-slate-100 mb-4 tracking-tight">{f.title}</h3>
            <p className="text-slate-800 dark:text-slate-400 leading-relaxed mb-8 text-lg font-medium">
              {f.desc}
            </p>
            <div className="flex items-center text-sm font-black text-slate-600 dark:text-slate-500 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-all">
              Launch Module <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </section>

      {/* Footer / Trust Badge */}
      <section className="text-center px-4 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap justify-center gap-12 text-slate-600 dark:text-slate-500 text-sm font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600" /> 100% Private
          </div>
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-pink-600" /> For Introverts
          </div>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-amber-600" /> Gemini Powered
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
