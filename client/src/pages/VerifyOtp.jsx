import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../utils/api';
import { ShieldCheck, KeyRound, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30); // seconds before Resend is enabled

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Arrived here without signing up first
  if (!email) return <Navigate to="/signup" replace />;

  const verify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setMsg({ type: 'error', text: 'Please enter the valid 6-digit code' });
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await api.post('/auth/verify-otp', { email, otp });
      navigate('/login', { state: { verified: true } });
    } catch (err) {
      setMsg({ type: 'error', text: errMsg(err) });
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      setMsg({ type: 'ok', text: 'A fresh OTP has been sent to your email' });
      setCooldown(30);
    } catch (err) {
      setMsg({ type: 'error', text: errMsg(err) });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-3">
            <ShieldCheck className="w-4 h-4" /> Email Verification
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enter verification code</h1>
          <p className="mt-2 text-sm text-slate-600">
            We sent a 6-digit code to <b className="text-slate-900">{email}</b>. It expires in 10 minutes.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
          
          {msg.text && (
            <div className={`mb-6 rounded-xl p-4 text-sm flex items-center gap-2 border ${
              msg.type === 'ok' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {msg.type === 'ok' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={verify} className="space-y-6" noValidate>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                inputMode="numeric"
                maxLength={6}
                autoFocus
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 text-center text-2xl tracking-[0.5em] placeholder-slate-300 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="------"
                aria-label="6-digit OTP"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 px-6 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? 'Verifying Code...' : 'Verify OTP'}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={resend} 
                disabled={cooldown > 0} 
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 disabled:text-slate-400 disabled:hover:text-slate-400 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${cooldown > 0 ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}