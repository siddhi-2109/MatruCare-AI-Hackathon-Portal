import React from 'react';
import { HeartPulse, Users, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> Revolutionizing Maternal Healthcare
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            About MatruCare AI
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            We build next-generation technology to radically improve maternal healthcare outcomes through intelligent, AI-driven solutions.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-purple-600" /> Our Mission & Vision
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Our annual hackathon brings together brilliant student innovators, developers, and problem-solvers to design practical, scalable AI-driven solutions. We focus on bridging critical gaps across web infrastructure, IoT diagnostics, data security, and decentralized medical records.
          </p>
        </div>

        {/* Grid Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Team & Participation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Participants register individually or form dynamic teams of up to five members, combining diverse skill sets to build robust multi-domain applications.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Submission & Judging</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Teams submit their comprehensive project ideas featuring a detailed presentation (PPT), a functional live prototype, and an optional video demonstration.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}