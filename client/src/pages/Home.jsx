import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Trophy, Calendar, Users, Cpu, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const highlights = [
  { t: '48 Hours of Building', d: 'Prototype AI solutions for real healthcare problems with mentors on call.', icon: Cpu },
  { t: 'Five Tracks', d: 'AI/ML, Web Dev, IoT, Cyber Security and Blockchain.', icon: Sparkles },
  { t: 'Teams of 1 to 5', d: 'Compete solo or bring your squad.', icon: Users },
  { t: 'Industry Mentors', d: 'Get feedback from engineers and clinicians.', icon: ShieldCheck },
];

const timeline = [
  { s: 'Registrations Open', d: 'Sign up, verify your email and submit your idea.' },
  { s: 'Idea Screening', d: 'Submitted PPTs and prototypes are reviewed.' },
  { s: 'Hackathon Day', d: 'Build, demo and pitch to the judges.' },
  { s: 'Results', d: 'Winners announced and prizes awarded.' },
];

const prizes = [
  { p: '1st Prize', a: 'Rs. 50,000', badge: '🏆 Winner', c: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-900' },
  { p: '2nd Prize', a: 'Rs. 30,000', badge: '🥈 Runner Up', c: 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-900' },
  { p: '3rd Prize', a: 'Rs. 15,000', badge: '🥉 Second Runner Up', c: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-900' },
];

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 px-4 py-24 text-center text-white sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-200 backdrop-blur-md mb-6 border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400" /> MatruCare AI Presents
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight leading-tight sm:text-6xl lg:text-7xl">
            The MatruCare AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hackathon</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Build AI-powered solutions that make a real difference in maternal healthcare. Register your team and compete for exciting prizes.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-purple-900 shadow-lg hover:bg-purple-50 transition-all transform hover:-translate-y-0.5">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-600/30 hover:bg-purple-500 transition-all transform hover:-translate-y-0.5">
                  Register Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-all">
                  Login to Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Event Highlights</h2>
          <p className="mt-4 text-slate-600">Everything you need to know about the 48-hour builder experience.</p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div key={idx} className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-purple-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{h.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{h.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Hackathon Timeline</h2>
            <p className="mt-4 text-slate-600">From registration to victory—your path through the event.</p>
          </div>
          
          <div className="relative border-l-2 border-purple-200 ml-4 sm:ml-32 space-y-12">
            {timeline.map((t, i) => (
              <div key={t.s} className="relative pl-8 sm:pl-12">
                <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white shadow-md ring-4 ring-white">
                  {i + 1}
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Phase {i + 1}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">{t.s}</h3>
                  <p className="text-slate-600 text-sm">{t.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" /> Exciting Rewards
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Prizes & Recognition</h2>
          <p className="mt-4 text-slate-600">Compete for cash prizes and fast-track incubation opportunities.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {prizes.map((p) => (
            <div key={p.p} className={`rounded-3xl p-8 text-center border shadow-sm ${p.c} flex flex-col justify-between transform transition hover:-translate-y-1`}>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-xs font-bold shadow-sm mb-4">
                  {p.badge}
                </span>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">{p.p}</div>
                <div className="mt-3 text-4xl font-extrabold tracking-tight">{p.a}</div>
              </div>
              <div className="mt-8 text-xs font-medium opacity-75">Certificate + Swag Kit included</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 py-20 text-white text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">Ready to build the future of healthcare?</h2>
          <p className="mt-4 text-purple-200 text-lg">Secure your spot today and start collaborating with top student developers.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to={user ? '/register-hackathon' : '/signup'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-purple-900 shadow-xl hover:bg-purple-50 transition-all">
              Register Now <ArrowRight className="w-5 h-5" />
            </Link>
            {!user && (
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}