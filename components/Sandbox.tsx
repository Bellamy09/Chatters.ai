
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getSandboxFeedback } from '../services/geminiService';
import { SandboxMessage, User } from '../types';
import { saveHistoryItem } from '../services/storageService';
import { Send, User as UserIcon, Bot, GraduationCap, Loader2, Save, Check, Mic, Sparkles } from 'lucide-react';

interface SandboxProps {
  user?: User | null;
}

const Sandbox: React.FC<SandboxProps> = ({ user }) => {
  const [messages, setMessages] = useState<SandboxMessage[]>([
    { role: 'ai', text: "Hi! I'm your practice partner. What situation would you like to practice today? (e.g. Asking for a raise, a first date, or telling a friend 'no')" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: SandboxMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setHasSaved(false);

    const history = messages.concat(userMsg).map(m => ({ role: m.role, text: m.text }));
    const result = await getSandboxFeedback(history);

    setMessages(prev => [
      ...prev, 
      { role: 'ai', text: result.reply },
      { role: 'coach', text: result.feedback }
    ]);
    setIsTyping(false);
  };

  const saveSession = () => {
    if (user && messages.length > 1) {
      saveHistoryItem(user.id, {
        type: 'sandbox',
        data: { messages }
      });
      setHasSaved(true);
    }
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
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-14rem)] min-h-[600px] py-4">
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Sparkles className="text-amber-600" size={20} />
            </div>
            <h3 className="font-black text-2xl text-slate-950 dark:text-slate-100 tracking-tight">Practice Lab</h3>
        </div>
        {user && messages.length > 1 && (
          <button 
            onClick={saveSession}
            disabled={hasSaved}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all shadow-sm ${
              hasSaved 
                ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            {hasSaved ? <Check size={14} /> : <Save size={14} />}
            {hasSaved ? 'Session Saved' : 'Save Session'}
          </button>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth bg-white/40 dark:bg-slate-950/30 rounded-[2.5rem] border border-slate-200 dark:border-slate-800/50 mb-6 no-scrollbar shadow-inner"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'user' ? 'bg-indigo-600 shadow-indigo-100' : m.role === 'ai' ? 'bg-slate-800 dark:bg-slate-700' : 'bg-amber-500 shadow-amber-100'
              }`}>
                {m.role === 'user' ? <UserIcon size={20} className="text-white" /> : 
                 m.role === 'ai' ? <Bot size={20} className="text-white" /> : 
                 <GraduationCap size={20} className="text-white" />}
              </div>
              
              <div className={`p-5 rounded-3xl text-sm transition-all duration-300 leading-relaxed ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-50 dark:shadow-none' : 
                m.role === 'ai' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm' : 
                'bg-amber-100/80 dark:bg-amber-900/20 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 italic rounded-tl-none shadow-sm'
              }`}>
                {m.role === 'coach' && <div className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-amber-800 dark:text-amber-400 border-b border-amber-300/50 dark:border-amber-800/50 pb-1">AI Coach Insights</div>}
                <p className="text-base font-bold">{m.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <Loader2 className="animate-spin text-white" size={18} />
              </div>
              <div className="bg-white/50 dark:bg-slate-800/50 px-6 py-3 rounded-3xl text-slate-500 dark:text-slate-500 text-sm font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass p-3 rounded-[2rem] flex gap-3 items-center shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all focus-within:ring-4 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/20">
        <input 
          type="text"
          className="flex-1 bg-transparent px-6 py-4 outline-none text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 font-bold text-lg"
          placeholder="Say something to your practice partner..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={toggleListening}
          className={`p-4 rounded-2xl transition-all ${
            isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isListening ? "Listening..." : "Voice input"}
        >
          <Mic size={24} />
        </button>
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100 dark:shadow-none"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sandbox;
