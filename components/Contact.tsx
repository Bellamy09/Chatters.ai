
import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Loader2, User, Type, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const TARGET_EMAIL = 'zhaohaw@uci.edu';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const mailtoSubject = encodeURIComponent(`Chatters.ai Contact: ${formData.subject}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.fullName}\n` +
      `Reply-To: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    );
    const mailtoLink = `mailto:${TARGET_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
    setLoading(false);
    setSubmitted(true);
    window.location.href = mailtoLink;
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in fade-in zoom-in-95">
        <div className="inline-flex p-6 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 mb-6 shadow-xl shadow-emerald-50 dark:shadow-none">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">Draft Prepared!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          We've prepared your message for <strong>our team</strong>. 
          Your email app should have opened automatically. If not, click the button below to finalize your message.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <button 
            onClick={() => {
              const mailtoSubject = encodeURIComponent(`Chatters.ai Contact: ${formData.subject}`);
              const mailtoBody = encodeURIComponent(`Name: ${formData.fullName}\nReply-To: ${formData.email}\n\nMessage:\n${formData.message}`);
              window.location.href = `mailto:${TARGET_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
            }}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
          >
            <ExternalLink size={18} /> Open Mail Client Again
          </button>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({ fullName: '', email: '', subject: '', message: '' });
            }}
            className="text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm py-2"
          >
            Start New Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">Get in Touch</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Your feedback goes directly to <strong>our team</strong>.
        </p>
      </div>

      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-white/50 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Your Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Subject</label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Message</label>
            <textarea 
              required
              rows={5}
              className="w-full px-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 outline-none transition-all shadow-sm resize-none text-slate-900 dark:text-white"
              placeholder="Your message here..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {loading ? 'Preparing Draft...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
