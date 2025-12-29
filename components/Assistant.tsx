
import React, { useState, useCallback } from 'react';
import { getResponseSuggestions } from '../services/geminiService';
import { Suggestion, User } from '../types';
import { saveHistoryItem } from '../services/storageService';
import { Loader2, MessageSquare, Sparkles, Copy, Check, Mic } from 'lucide-react';

interface AssistantProps {
  user?: User | null;
}

const Assistant: React.FC<AssistantProps> = ({ user }) => {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const results = await getResponseSuggestions(input, context);
    setSuggestions(results);
    setLoading(false);

    if (user && results.length > 0) {
      saveHistoryItem(user.id, {
        type: 'reply',
        data: { input, context, suggestions: results }
      });
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.start();
  }, [isListening]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="glass rounded-3xl p-8 md:p-10 shadow-sm border border-white transition-all">
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100 mb-8 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <MessageSquare className="text-indigo-600" />
          </div>
          Reply Buddy
        </h2>
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400 mb-2 px-1">Incoming Message</label>
            <textarea
              className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
              rows={4}
              placeholder="What did they send you?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              onClick={toggleListening}
              className={`absolute right-4 bottom-5 p-2.5 rounded-xl transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isListening ? "Listening..." : "Click to speak"}
            >
              <Mic size={22} />
            </button>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400 mb-2 px-1">Extra Context (Optional)</label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
              placeholder="e.g. A dating app, first date, work colleague..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Craft Perfect Responses
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 px-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Suggestions</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          {suggestions.map((s, idx) => (
            <div key={idx} className="glass rounded-[2rem] p-8 border-l-[10px] border-indigo-500 group relative transition-all hover:translate-x-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full">
                  {s.vibe}
                </span>
                <button 
                  onClick={() => copyToClipboard(s.content, idx)}
                  className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                >
                  {copiedIndex === idx ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-slate-950 dark:text-slate-100 font-bold text-2xl leading-tight mb-4 tracking-tight">"{s.content}"</p>
              <p className="text-sm text-slate-800 dark:text-slate-400 font-bold leading-relaxed italic">{s.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assistant;
