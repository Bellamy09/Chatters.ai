
import React, { useState } from 'react';
import { analyzeVibe } from '../services/geminiService';
import { VibeAnalysis } from '../types';
import { Search, Loader2, Info, ShieldCheck } from 'lucide-react';

const VibeCheck: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const res = await analyzeVibe(text);
    setAnalysis(res);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="glass rounded-2xl p-6 shadow-sm transition-colors">
        <h2 className="text-xl font-black text-slate-950 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Search className="text-emerald-600" />
          Vibe Decoder
        </h2>
        <div className="space-y-4">
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 shadow-inner"
            rows={4}
            placeholder="Paste a confusing message to decode its vibe..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !text}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Decode Intent'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="glass rounded-xl p-6 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-950 dark:text-slate-100 flex items-center gap-2">
                <Info className="text-emerald-600" size={18} />
                Analysis Results
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-4 w-1.5 rounded-full ${i < analysis.intensity ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1">The Tone</p>
                <p className="text-slate-950 dark:text-slate-200 font-bold">{analysis.tone}</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <p className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1">Hidden Meaning</p>
                <p className="text-slate-950 dark:text-slate-200 font-bold">{analysis.hiddenMeaning}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-slate-300 mb-1">Suggested Way to Handle It</p>
                <p className="text-sm text-slate-800 dark:text-slate-400 font-bold leading-relaxed">{analysis.suggestedAction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VibeCheck;
