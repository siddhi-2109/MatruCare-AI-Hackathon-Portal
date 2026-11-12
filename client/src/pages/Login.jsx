import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(errMsg(err));
      if (err?.response?.data?.needsVerification) setUnverifiedEmail(err.response.data.email);
    } finally {
      setLoading(false);
    }
  };

  const goVerify = async () => {
    try {
      await api.post('/auth/resend-otp', { email: unverifiedEmail });
    } catch (_) { /* user can resend from the next page */ }
    navigate('/verify-otp', { state: { email: unverifiedEmail } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Welcome Back
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Log in to your account</h1>
          <p className="mt-2 text-sm text-slate-600">Access your dashboard and hackathon submissions.</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
          
          {state?.verified && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>Email verified successfully. Please log in.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {unverifiedEmail && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-xs text-amber-800 mb-2 font-medium">Your email address has not been verified yet.</p>
              <button 
                type="button" 
                onClick={goVerify} 
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900 underline hover:text-amber-950"
              >
                Verify your email now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={submit} className="space-y-6" noValidate>
            
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
                  required 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
                  placeholder="you@example.com"
                  value={form.email} 
                  onChange={onChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
                  placeholder="••••••••"
                  value={form.password} 
                  onChange={onChange} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 px-6 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-slate-600 pt-2">
              New here?{' '}
              <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                Create an account
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}