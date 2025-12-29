
import React, { useState } from 'react';
import { generateIcebreakers } from '../services/geminiService';
import { IcebreakerParams } from '../types';
import { UserPlus, PartyPopper, Loader2, Copy, Check } from 'lucide-react';

const Icebreakers: React.FC = () => {
  const [params, setParams] = useState<IcebreakerParams>({
    context: '',
    relationship: 'Strangers',
    intensity: 'casual'
  });
  const [loading, setLoading] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!params.context) return;
    setLoading(true);
    const results = await generateIcebreakers(params);
    setStarters(results);
    setLoading(false);
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass rounded-2xl p-6 shadow-sm transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <PartyPopper className="text-pink-500" />
          The Great Opener
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">The Setting</label>
            <input 
              type="text"
              placeholder="e.g. Wedding, Coffee shop, LinkedIn, Gym..."
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-pink-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
              value={params.context}
              onChange={(e) => setParams({...params, context: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Relationship</label>
            <select 
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
              value={params.relationship}
              onChange={(e) => setParams({...params, relationship: e.target.value})}
            >
              <option value="Strangers">Strangers</option>
              <option value="Old Friends">Old Friends</option>
              <option value="Acquaintances">Acquaintances</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Vibe</label>
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              {(['casual', 'meaningful', 'funny'] as const).map((v) => (
                <button
                  key={v}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                    params.intensity === v 
                      ? 'bg-white dark:bg-slate-800 shadow-sm text-pink-600 dark:text-pink-400' 
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                  onClick={() => setParams({...params, intensity: v})}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !params.context}
          className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-100 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
          Get Starters
        </button>
      </div>

      <div className="space-y-3">
        {starters.map((s, i) => (
          <div key={i} className="glass group hover:border-pink-200 dark:hover:border-pink-900/50 p-5 rounded-xl flex items-center justify-between transition-all duration-300 dark:bg-slate-800/40">
            <p className="text-slate-800 dark:text-slate-100 text-lg leading-relaxed">"{s}"</p>
            <button 
              onClick={() => copy(s, i)}
              className="p-2 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg text-slate-400 hover:text-pink-500 transition-colors"
            >
              {copiedIdx === i ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Icebreakers;
