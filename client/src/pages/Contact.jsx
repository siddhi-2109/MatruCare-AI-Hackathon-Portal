import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, User, MessageSquare, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.fullName || '', email: user?.email || '', message: '' });
  const [errors, setErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    
    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:matrucareai@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> Get in Touch
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Contact Us</h1>
          <p className="mt-3 text-slate-600">
            Have questions about the hackathon? Reach us directly at{' '}
            <a className="text-purple-600 font-semibold hover:underline" href="mailto:matrucareai@gmail.com">
              matrucareai@gmail.com
            </a>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
          <form onSubmit={submit} className="space-y-6" noValidate>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  id="name" 
                  name="name" 
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? 'border-red-300 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-purple-600 focus:ring-purple-600/20'
                  }`}
                  placeholder="Enter your name"
                  value={form.name} 
                  onChange={onChange} 
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-300 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-purple-600 focus:ring-purple-600/20'
                  }`}
                  placeholder="you@example.com"
                  value={form.email} 
                  onChange={onChange} 
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="message">
                Message
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-slate-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.message ? 'border-red-300 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-purple-600 focus:ring-purple-600/20'
                  }`}
                  placeholder="Write your message here (at least 10 characters)..."
                  value={form.message} 
                  onChange={onChange} 
                />
              </div>
              {errors.message && (
                <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 px-6 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" /> Send Message via Email Client
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}