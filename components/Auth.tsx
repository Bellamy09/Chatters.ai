
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, CheckCircle2, XCircle, ArrowRight, Loader2, User as UserIcon, Calendar, UserPlus, AlertCircle } from 'lucide-react';
import { saveUser, findUser, setSession } from '../services/storageService';
import { User } from '../types';

interface AuthProps {
  onSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Credentials, 2: Profile Info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'error' | 'warning' | ''>('');

  // Step 1 State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const passwordValidation = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[@$!%*?&#]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  useEffect(() => {
    setError('');
    setErrorType('');
  }, [isLogin]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    
    if (isLogin) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      
      const user = findUser(email);
      if (!user) {
        setError("We couldn't find an account with that email address. Would you like to create one?");
        setErrorType('warning');
      } else if (user.password !== password) {
        setError("The password you entered is incorrect. Please double-check and try again.");
        setErrorType('error');
      } else {
        setSession(user);
        onSuccess(user);
      }
      setLoading(false);
    } else {
      if (!isPasswordValid) {
        setError('Please make sure your password meets all the security requirements listed below.');
        setErrorType('error');
        return;
      }
      if (findUser(email)) {
        setError('This email is already registered. Try signing in to your existing account.');
        setErrorType('warning');
        return;
      }
      setStep(2);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newUser: User = { 
      email, 
      id: Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      username,
      gender,
      age
    };

    saveUser(newUser, password);
    setSession(newUser);
    onSuccess(newUser);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/40 dark:border-slate-800 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-[#3B66FF] text-white mb-4 shadow-lg shadow-blue-100 dark:shadow-none">
            {step === 1 ? <ShieldCheck size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {isLogin ? 'Welcome Back' : (step === 1 ? 'Join Chatters' : 'Tell us about yourself')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
            {isLogin ? 'Sign in to access your social bridge' : (step === 1 ? 'Set up your secure login credentials' : 'Help us personalize your social coaching')}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            errorType === 'warning' 
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-800/50' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-100 dark:border-red-800/50'
          }`}>
            {errorType === 'warning' ? <AlertCircle className="shrink-0 mt-0.5" size={18} /> : <XCircle className="shrink-0 mt-0.5" size={18} />}
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleCredentialSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20" size={18} />
                <input 
                  type="email" 
                  required
                  className="relative z-10 w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20" size={18} />
                <input 
                  type="password" 
                  required
                  className="relative z-10 w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <ValidationItem label="8+ Characters" valid={passwordValidation.length} />
                <ValidationItem label="Uppercase" valid={passwordValidation.hasUpper} />
                <ValidationItem label="Lowercase" valid={passwordValidation.hasLower} />
                <ValidationItem label="Number" valid={passwordValidation.hasNumber} />
                <ValidationItem label="Special Char" valid={passwordValidation.hasSpecial} />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || (!isLogin && password.length > 0 && !isPasswordValid)}
              className="w-full py-4 bg-[#3B66FF] hover:bg-[#3258E6] text-white font-bold rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Continue to Profile')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">First Name</label>
                <input 
                  type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none shadow-sm transition-all text-slate-900 dark:text-white"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Last Name</label>
                <input 
                  type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none shadow-sm transition-all text-slate-900 dark:text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Display Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20" size={16} />
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  className="relative z-10 w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none shadow-sm transition-all text-slate-900 dark:text-white"
                  placeholder="social_explorer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Gender</label>
                <select 
                  required value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none shadow-sm transition-all appearance-none text-slate-900 dark:text-white"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20" size={16} />
                  <input 
                    type="number" required value={age} onChange={(e) => setAge(e.target.value)}
                    className="relative z-10 w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-[#3B66FF] outline-none shadow-sm transition-all text-slate-900 dark:text-white"
                    placeholder="24"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-[#3B66FF] hover:bg-[#3258E6] text-white font-bold rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Complete Sign Up'}
              {!loading && <CheckCircle2 size={18} />}
            </button>
          </form>
        )}

        {step === 1 && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-[#3B66FF] dark:hover:text-[#3B66FF] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ValidationItem = ({ label, valid }: { label: string, valid: boolean }) => (
  <div className={`flex items-center gap-2 text-[10px] font-bold transition-colors ${valid ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
    {valid ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-700" />}
    {label}
  </div>
);

export default Auth;
