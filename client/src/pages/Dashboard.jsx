import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, Building2, GraduationCap, Layers, FolderGit2, FileText, Monitor, Video, Users, Trash2, CheckCircle2, AlertCircle, ExternalLink, PlusCircle } from 'lucide-react';

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4 border-b border-slate-100 last:border-none">
    <dt className="flex items-center gap-2 w-44 shrink-0 text-sm font-medium text-slate-500">
      {Icon && <Icon className="w-4 h-4 text-purple-600" />}
      {label}
    </dt>
    <dd className="break-words text-sm font-semibold text-slate-900">{children || '-'}</dd>
  </div>
);

const LinkVal = ({ href, label }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-medium underline">
      {label} <ExternalLink className="w-3.5 h-3.5" />
    </a>
  ) : <span className="text-slate-400">Not provided</span>;

export default function Dashboard() {
  const { user } = useAuth();
  const [entry, setEntry] = useState(undefined); // undefined = loading, null = not registered
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/hackathon/my-entry')
      .then((res) => setEntry(res.data.entry))
      .catch((err) => { setError(errMsg(err)); setEntry(null); });
  }, []);

  const remove = async () => {
    if (!window.confirm('Are you sure you want to delete your registration? This cannot be undone.')) return;
    try {
      await api.delete(`/hackathon/${entry._id}`);
      setEntry(null);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your profile details and hackathon submission status.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" /> Account Profile
          </h2>
          <dl className="divide-y divide-slate-100">
            <Row icon={User} label="Full Name">{user?.fullName}</Row>
            <Row icon={Mail} label="Email Address">{user?.email}</Row>
          </dl>
        </div>

        {/* Hackathon Registration Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-purple-600" /> Hackathon Registration
            </h2>
            
            {entry === undefined && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 animate-pulse">
                Checking status...
              </span>
            )}
            {entry === null && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Not Registered
              </span>
            )}
            {entry && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Registered Successfully
              </span>
            )}
          </div>

          {entry === undefined && (
            <p className="text-sm text-slate-500 py-4">Loading your registration details...</p>
          )}

          {entry === null && (
            <div className="py-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between bg-slate-50 rounded-xl p-6 border border-dashed border-slate-300">
              <div>
                <p className="text-sm font-medium text-slate-900">You have not registered for the MatruCare AI Hackathon yet.</p>
                <p className="text-xs text-slate-500 mt-1">Submit your team and project details to participate in the 48-hour builder event.</p>
              </div>
              <Link to="/register-hackathon" className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-purple-500 transition-all">
                <PlusCircle className="w-4 h-4" /> Register Now
              </Link>
            </div>
          )}

          {entry && (
            <>
              <dl className="divide-y divide-slate-100">
                <Row icon={User} label="Participant Name">{entry.fullName}</Row>
                <Row icon={Phone} label="Mobile Number">{entry.mobile}</Row>
                <Row icon={Building2} label="College">{entry.college}</Row>
                <Row icon={GraduationCap} label="Course / Branch">{`${entry.course} - ${entry.branch}`}</Row>
                <Row icon={BookOpen} label="Academic Year">{entry.year}</Row>
                <Row icon={Layers} label="Hackathon Track">{entry.domain}</Row>
                <Row icon={FolderGit2} label="Project Name">{entry.projectName}</Row>
                <Row icon={FileText} label="Presentation (PPT)"><LinkVal href={entry.pptLink} label="View Slide Deck" /></Row>
                <Row icon={Monitor} label="Prototype URL"><LinkVal href={entry.prototypeLink} label="Open Live Prototype" /></Row>
                <Row icon={Video} label="Demo Video"><LinkVal href={entry.demoLink} label="Watch Demo Video" /></Row>
                <Row icon={Users} label="Team Size">{entry.teamSize} Member(s)</Row>
              </dl>

              {entry.members && entry.members.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" /> Team Members ({entry.members.length})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {entry.members.map((m, i) => (
                      <div key={i} className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col justify-between">
                        <span className="text-sm font-semibold text-slate-900">{m.name}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{m.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Registered on {new Date(entry.createdAt || Date.now()).toLocaleDateString()}</span>
                <button 
                  onClick={remove} 
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Registration
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}