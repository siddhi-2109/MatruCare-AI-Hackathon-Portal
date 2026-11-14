import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../utils/api';
import { User, Mail, Lock, UserPlus, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 3) e.fullName = 'Name must be at least 3 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/auth/signup', form);
      navigate('/verify-otp', { state: { email: res.data.email } });
    } catch (err) {
      setServerError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', Icon) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor={name}>{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input 
          id={name} 
          name={name} 
          type={type} 
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors[name] ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-purple-600 focus:ring-purple-600/20'
          }`}
          placeholder={label === 'Full Name' ? 'John Doe' : label === 'Email' ? 'you@example.com' : '••••••••'}
          value={form[name]} 
          onChange={onChange} 
        />
      </div>
      {errors[name] && (
        <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Get Started
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">Join the MatruCare AI Hackathon portal.</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
          <form onSubmit={submit} className="space-y-6" noValidate>
            
            {serverError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" /> {serverError}
              </div>
            )}

            {field('fullName', 'Full Name', 'text', User)}
            {field('email', 'Email', 'email', Mail)}
            {field('password', 'Password', 'password', Lock)}
            {field('confirmPassword', 'Confirm Password', 'password', Lock)}

            <button 
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 px-6 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Sending OTP...' : 'Sign up'}
            </button>

            <p className="text-center text-sm text-slate-600 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                Login
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}