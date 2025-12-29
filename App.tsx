import React, { useState, useEffect, useRef } from 'react';
import { AppView, User } from './types';
import Home from './components/Home';
import Assistant from './components/Assistant';
import VibeCheck from './components/VibeCheck';
import Sandbox from './components/Sandbox';
import Icebreakers from './components/Icebreakers';
import About from './components/About';
import Contact from './components/Contact';
import Auth from './components/Auth';
import HistoryView from './components/HistoryView';
import { getSession, setSession } from './services/storageService';
import { 
  MessageCircle, 
  UserPlus, 
  Gamepad2, 
  Eye, 
  Compass,
  Home as HomeIcon,
  LogOut,
  Clock,
  ChevronDown,
  User as UserIcon,
  Info,
  Mail,
  Moon,
  Sun
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('chatters_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chatters_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chatters_theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    setActiveView(AppView.HOME);
    setIsUserDropdownOpen(false);
  };

  const navItems = [
    { id: AppView.HOME, label: 'Home' },
    { id: AppView.ASSISTANT, label: 'Reply Buddy' },
    { id: AppView.VIBE_CHECK, label: 'Vibe Decoder' },
    { id: AppView.ICEBREAKER, label: 'Icebreakers' },
    { id: AppView.SANDBOX, label: 'Practice Lab' },
    { id: AppView.ABOUT, label: 'About Us' },
    { id: AppView.CONTACT, label: 'Contact' }
  ];

  const navigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 h-20 shadow-sm flex items-center transition-colors">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate(AppView.HOME)}
          >
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 p-2 rounded-xl shadow-sm">
              <Compass className="text-white" size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Chatters<span className="text-indigo-600">.</span>ai
            </h1>
          </div>

          <nav className="flex-1 hidden md:flex items-center justify-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-sm font-semibold whitespace-nowrap px-3 py-2 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  activeView === item.id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative shrink-0">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

            <div ref={dropdownRef}>
              {user ? (
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 bg-[#3B66FF] hover:bg-[#3258E6] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100/50 dark:shadow-none group"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 hidden sm:flex items-center justify-center shrink-0">
                    <UserIcon size={12} />
                  </div>
                  <span className="max-w-[70px] sm:max-w-none truncate">{user.username}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate(AppView.AUTH)}
                  className="px-4 md:px-8 py-2.5 bg-[#3B66FF] hover:bg-[#3258E6] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100/50 dark:shadow-none flex items-center gap-2 whitespace-nowrap"
                >
                  <UserIcon size={16} className="hidden sm:block" /> Sign In
                </button>
              )}

              {isUserDropdownOpen && user && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { navigate(AppView.HISTORY); setIsUserDropdownOpen(false); }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
                    >
                      <Clock size={18} className="text-slate-400" /> My History
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-3 transition-colors mt-1"
                    >
                      <LogOut size={18} className="text-red-400" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <div>
          {activeView === AppView.HOME && <Home onNavigate={navigate} />}
          {activeView === AppView.AUTH && <Auth onSuccess={(u) => { setUser(u); navigate(AppView.HOME); }} />}
          {activeView === AppView.ASSISTANT && <Assistant user={user} />}
          {activeView === AppView.VIBE_CHECK && <VibeCheck />}
          {activeView === AppView.ICEBREAKER && <Icebreakers />}
          {activeView === AppView.SANDBOX && <Sandbox user={user} />}
          {activeView === AppView.ABOUT && <About />}
          {activeView === AppView.CONTACT && <Contact />}
          {activeView === AppView.HISTORY && user && <HistoryView user={user} />}
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-4 z-50">
        <button onClick={() => navigate(AppView.HOME)} className={`p-2 rounded-lg ${activeView === AppView.HOME ? 'text-indigo-600' : 'text-slate-400'}`}>
          <HomeIcon size={24} />
        </button>
        <button onClick={() => navigate(AppView.ASSISTANT)} className={`p-2 rounded-lg ${activeView === AppView.ASSISTANT ? 'text-indigo-600' : 'text-slate-400'}`}>
          <MessageCircle size={24} />
        </button>
        <button onClick={() => navigate(AppView.SANDBOX)} className={`p-2 rounded-lg ${activeView === AppView.SANDBOX ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Gamepad2 size={24} />
        </button>
        <button onClick={() => navigate(AppView.AUTH)} className={`p-2 rounded-lg ${activeView === AppView.AUTH ? 'text-indigo-600' : 'text-slate-400'}`}>
          <UserIcon size={24} />
        </button>
      </nav>
    </div>
  );
};

export default App;