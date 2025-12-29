
import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/storageService';
import { StoredItem, User } from '../types';
import { Clock, MessageSquare, Search, Gamepad2, ChevronRight, Calendar } from 'lucide-react';

const HistoryView: React.FC<{ user: User }> = ({ user }) => {
  const [items, setItems] = useState<StoredItem[]>([]);

  useEffect(() => {
    setItems(getHistory(user.id));
  }, [user.id]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
          <Clock size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No History Yet</h3>
        <p className="text-slate-500 dark:text-slate-400">Your generated replies and practice sessions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
        <Clock className="text-indigo-500" /> My Social Journey
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-6 border-white/50 dark:border-slate-800/50 hover:shadow-lg dark:hover:bg-slate-800/40 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${
                  item.type === 'reply' ? 'bg-indigo-500' : 
                  item.type === 'vibe' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  {item.type === 'reply' ? <MessageSquare size={16} /> : 
                   item.type === 'vibe' ? <Search size={16} /> : <Gamepad2 size={16} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 capitalize">{item.type} session</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                    <Calendar size={10} />
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {item.type === 'reply' && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Input Message</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{item.data.input}"</p>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />
                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Top Suggestion</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">"{item.data.suggestions[0]?.content}"</p>
              </div>
            )}

            {item.type === 'vibe' && (
              <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-800/50">
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Decoded Analysis</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{item.data.tone} • {item.data.hiddenMeaning}</p>
              </div>
            )}

            {item.type === 'sandbox' && (
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Conversation with {item.data.messages.length} exchanges</p>
                <div className="text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                  Practice Mode <ChevronRight size={14} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
