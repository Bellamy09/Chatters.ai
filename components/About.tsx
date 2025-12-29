
import React, { useState } from 'react';
import { ShieldCheck, Target, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

const FOUNDER_IMAGE_URL = "founder.png"; 

const TeamCard = ({ name, role, points, imageUrl }: { name: string, role: string, points: string[], imageUrl: string }) => {
  const [error, setError] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center transition-all duration-500 hover:translate-y-[-8px] max-w-lg mx-auto">
      {/* Circular Avatar */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mb-6 bg-slate-100 dark:bg-slate-800">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            setError(true);
            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=3B66FF&color=fff&size=256';
          }}
        />
        
        {error && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="text-amber-400 mb-1" size={20} />
            <p className="text-[10px] text-white font-bold leading-tight">
              Founder Photo Placeholder
            </p>
          </div>
        )}
      </div>

      {/* Identity */}
      <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">{name}</h3>
      <div className="px-6 py-1.5 rounded-full bg-gradient-to-r from-[#3B66FF] to-[#8B5CF6] text-white text-xs font-bold mb-8 shadow-lg shadow-blue-100 dark:shadow-none">
        {role}
      </div>

      {/* Achievement List */}
      <ul className="space-y-4 w-full text-left">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-[#3B66FF] shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const About: React.FC = () => {
  const founderData = {
    name: "Alice Wang",
    role: "Founder",
    imageUrl: FOUNDER_IMAGE_URL,
    points: [
      "Freshman at Cambridge Rindge and Latin School",
      "AIME Qualifier with a passion for mathematics and computer science",
      "Founded Chatters.ai to bridge AI technology and real-world social challenges",
      "Focused on developing analytical tools for social skill improvement in a safe environment"
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-20 py-12 px-4">
      <section className="text-center space-y-6">
        <h2 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">About Chatters.ai</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Chatters.ai is an AI-powered social bridge designed specifically for introverts. Our mission is to empower individuals who find social interactions challenging by providing them with the tools to communicate with confidence.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "Private & Secure", desc: "Your conversations and practice sessions are personal and stored locally.", color: "text-indigo-500" },
          { icon: Target, title: "Precision Coaching", desc: "Advanced AI models provide nuanced feedback on social dynamics.", color: "text-emerald-500" },
          { icon: Heart, title: "Introvert-Centric", desc: "Designed with empathy for those who find socializing energy-intensive.", color: "text-pink-500" }
        ].map((item, i) => (
          <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800 text-center space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className={`inline-flex p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${item.color}`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">Meet Our Founder</h2>
          <div className="w-20 h-1.5 bg-[#3B66FF] mx-auto rounded-full" />
        </div>
        
        <div className="flex justify-center lg:px-12">
          <TeamCard {...founderData} />
        </div>
      </section>

      <section className="glass rounded-[3rem] p-12 border border-white dark:border-slate-800 text-center space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Bridging the Gap</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We believe that technology should serve human connection. Chatters.ai isn't just an app; it's a movement towards more empathetic and effective communication in an increasingly digital world.
        </p>
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
            <CheckCircle2 size={12} /> AI-Powered
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full">
            <CheckCircle2 size={12} /> Safe Environment
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
