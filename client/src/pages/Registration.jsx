import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BRANCHES, COLLEGES, COURSES, DOMAINS, YEARS } from '../utils/options';
import { User, Mail, Phone, Building2, GraduationCap, BookOpen, Layers, FolderGit2, FileText, Monitor, Video, Users, Send, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRe = /^https?:\/\/\S+\.\S+/i;

export default function Registration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '', // pre-filled from the auth session
    mobile: '',
    college: '',
    course: '',
    branch: '',
    year: '',
    domain: '',
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoLink: '',
    teamSize: '1',
  });
  const [members, setMembers] = useState([]); // [{ name, email }]
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Rebuild the member boxes whenever team size changes. Size 1 = solo = no boxes.
  const onTeamSize = (e) => {
    const size = Number(e.target.value);
    setForm({ ...form, teamSize: e.target.value });
    const count = size === 1 ? 0 : size - 1; // Team size N means leader + N-1 team members
    setMembers((prev) => Array.from({ length: count }, (_, i) => prev[i] || { name: '', email: '' }));
  };

  const onMember = (i, key, value) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));

  const validate = () => {
    const e = {};
    if (!/^[A-Za-z ]{3,}$/.test(form.fullName.trim())) e.fullName = 'Min 3 characters, letters only';
    if (!emailRe.test(form.email)) e.email = 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit Indian mobile number';
    ['college', 'course', 'branch', 'year', 'domain'].forEach((f) => { if (!form[f]) e[f] = 'Please select an option'; });
    if (form.projectName.trim().length < 5) e.projectName = 'Min 5 characters';
    if (!urlRe.test(form.pptLink)) e.pptLink = 'Enter a valid shareable link';
    if (!urlRe.test(form.prototypeLink)) e.prototypeLink = 'Enter a valid link';
    if (form.demoLink && !urlRe.test(form.demoLink)) e.demoLink = 'Enter a valid link or leave blank';
    members.forEach((m, i) => {
      if (m.name.trim().length < 2) e[`m${i}name`] = 'Name is required';
      if (!emailRe.test(m.email)) e[`m${i}email`] = 'Valid email required';
    });
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setServerError('Please fix the highlighted fields before submitting.');
      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/hackathon/register', { ...form, teamSize: Number(form.teamSize), members });
      setSuccess(res.data);
    } catch (err) {
      setServerError(errMsg(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">You are registered!</h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {success.emailSent
              ? <>A confirmation email has been successfully sent to <b className="text-slate-900">{success.entry.email}</b>.</>
              : 'Your registration has been saved, but the confirmation email could not be sent right now.'}
          </p>
          <button 
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 px-6 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const text = (name, label, Icon, props = {}) => (
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
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors[name] ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-purple-600 focus:ring-purple-600/20'
          } ${props.readOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          value={form[name]} 
          onChange={onChange} 
          {...props} 
        />
      </div>
      {errors[name] && (
        <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors[name]}
        </p>
      )}
    </div>
  );

  const select = (name, label, options, Icon) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor={name}>{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select 
          id={name} 
          name={name} 
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 transition-all bg-white ${
            errors[name] ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-purple-600 focus:ring-purple-600/20'
          }`}
          value={form[name]} 
          onChange={onChange}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {errors[name] && (
        <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        
        {/* Navigation & Header */}
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
          <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mb-1">
            <Sparkles className="w-4 h-4" /> Official Application
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hackathon Registration</h1>
          <p className="text-sm text-slate-600 mt-1">Complete your team details and project links for submission.</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-10">
          <form onSubmit={submit} className="space-y-6" noValidate>
            
            {serverError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" /> {serverError}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {text('fullName', 'Full Name', User)}
              {text('email', 'Email Address', Mail, { type: 'email', readOnly: true })}
              {text('mobile', 'Mobile Number', Phone, { type: 'tel', inputMode: 'numeric', maxLength: 10, placeholder: '10-digit mobile number' })}
              <div className="sm:col-span-2">
                {select('college', 'College Name', COLLEGES, Building2)}
              </div>
              {select('course', 'Course', COURSES, GraduationCap)}
              {select('branch', 'Branch', BRANCHES, Layers)}
              {select('year', 'Year of Study', YEARS, BookOpen)}
              {select('domain', 'Domain / Track', DOMAINS, FolderGit2)}
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900">Project Details</h3>
              {text('projectName', 'Project Name', FolderGit2, { placeholder: 'Enter your project title' })}
              {text('pptLink', 'PPT Link (Google Drive / OneDrive)', FileText, { type: 'url', placeholder: 'https://' })}
              {text('prototypeLink', 'Prototype Link (GitHub / Figma / live demo)', Monitor, { type: 'url', placeholder: 'https://' })}
              {text('demoLink', 'Demo Video Link (Optional)', Video, { type: 'url', placeholder: 'https://' })}
            </div>

            <div className="border-t border-slate-200 pt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="teamSize">Team Size (1 to 5 Members)</label>
              <select id="teamSize" className="w-full sm:w-48 px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all font-medium" value={form.teamSize} onChange={onTeamSize}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? '(Solo)' : 'Members'}</option>)}
              </select>
            </div>

            {/* Dynamic team member entry */}
            {members.length > 0 && (
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" /> Additional Team Members Details
                </h3>
                {members.map((m, i) => (
                  <div key={i} className="grid gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor={`mn${i}`}>Member {i + 2} Name</label>
                      <input 
                        id={`mn${i}`} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-purple-600" 
                        placeholder="Full name"
                        value={m.name} 
                        onChange={(e) => onMember(i, 'name', e.target.value)} 
                      />
                      {errors[`m${i}name`] && <p className="mt-1 text-xs text-red-600 font-medium">{errors[`m${i}name`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor={`me${i}`}>Member {i + 2} Email</label>
                      <input 
                        id={`me${i}`} 
                        type="email" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-purple-600" 
                        placeholder="Email address"
                        value={m.email} 
                        onChange={(e) => onMember(i, 'email', e.target.value)} 
                      />
                      {errors[`m${i}email`] && <p className="mt-1 text-xs text-red-600 font-medium">{errors[`m${i}email`]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 px-6 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting Registration...' : 'Submit Hackathon Registration'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}