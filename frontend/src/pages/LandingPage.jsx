import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Video,
  Code2,
  Building2,
  FileSearch,
  TrendingUp,
  Flame,
  CheckCircle2,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-studio-bg flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Top Header */}
      <header className="h-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            🎯
          </div>
          <div>
            <span className="font-display font-black text-slate-900 text-xl tracking-tight">Interview AI</span>
            <p className="text-[11px] text-slate-500 font-medium">Practice like the interview is real.</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
          <a href="#modules" className="hover:text-brand-600 transition-colors">8 Core Modules</a>
          <a href="#companies" className="hover:text-brand-600 transition-colors">Company Intelligence</a>
          <a href="#autopsy" className="hover:text-brand-600 transition-colors">Forensic Autopsy</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
          >
            <span>Start Preparing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-200 text-brand-800 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Intelligent Placement & Interview Readiness Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Practice like the interview is <span className="text-brand-500 underline decoration-brand-200 underline-offset-8">real</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Company intelligence, cross-examination resume defense, adaptive voice-and-camera interview simulations, interactive technical coding defense, and deep forensic autopsy reports for students and job seekers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch Placement Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-sm font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-7 py-3.5 rounded-xl shadow-sm transition-all"
          >
            Explore Company Blueprints
          </Link>
        </div>

        {/* Pipeline Diagram Pill */}
        <div className="pt-8 flex items-center justify-center">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700">
            <span className="text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">Company Intelligence</span>
            <span>→</span>
            <span className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">Personalized Prep</span>
            <span>→</span>
            <span className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">Realistic Interview</span>
            <span>→</span>
            <span className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">Multimodal Evaluation</span>
            <span>→</span>
            <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">Interview Autopsy</span>
            <span>→</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">Weakness Elimination</span>
          </div>
        </div>
      </section>

      {/* Placement Preparation Workspaces */}
      <section id="workspaces" className="py-16 px-6 sm:px-12 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Complete Placement Preparation Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Engineered specifically for real placement drives. Every workspace targets an essential phase of actual campus & off-campus hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Command Center", subtitle: "Preparation Cockpit", desc: "Real-time readiness score, streak tracking, and personalized next best actions with root-cause recommendations.", icon: Layers, color: "text-blue-600 bg-blue-50 border-blue-200" },
              { title: "Company Intelligence", subtitle: "Verified Blueprints", desc: "Explore hiring patterns for Zoho, TCS, Amazon, Accenture, and compare company evaluation criteria side-by-side.", icon: Building2, color: "text-amber-600 bg-amber-50 border-amber-200" },
              { title: "Interview Studio", subtitle: "Realistic Live Room", desc: "Live virtual interview room with audio/camera checks, speech-to-text, real-time AI voice, and adaptive follow-up probing.", icon: Video, color: "text-rose-600 bg-rose-50 border-rose-200" },
              { title: "Resume Defense", subtitle: "Project Verification", desc: "Extracts technical claims from your PDF resume and cross-examines your architectural choices with live credibility scoring.", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
              { title: "Technical Arena", subtitle: "Coding & Code Defense", desc: "Interactive developer coding workspace with test case execution followed by algorithmic design defense.", icon: Code2, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
              { title: "Interview Autopsy", subtitle: "Forensic Analysis", desc: "Post-interview feedback report with question scoring, pacing analytics, and interactive replay timeline.", icon: FileSearch, color: "text-purple-600 bg-purple-50 border-purple-200" },
              { title: "Placement Readiness", subtitle: "Progress & Skill Matrix", desc: "Comprehensive skill radar matrices, weakness evolution tracking across attempts, and company probability scores.", icon: TrendingUp, color: "text-teal-600 bg-teal-50 border-teal-200" },
              { title: "Challenge Hub", subtitle: "Interactive Placement Sprints", desc: "Train under Pressure Rounds, Weakness Attacks, Technical Deep Dives, and 10-Question Daily Company Sprints.", icon: Flame, color: "text-orange-600 bg-orange-50 border-orange-200" }
            ].map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-studio-bg/50 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold ${mod.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-sm">{mod.title}</h3>
                      <div className="text-[11px] font-semibold text-brand-600">{mod.subtitle}</div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400 py-10 px-6 sm:px-12 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span className="font-display font-bold text-white text-sm">Interview AI</span>
            <span className="text-slate-500">— Practice like the interview is real.</span>
          </div>
          <div className="text-slate-500">
            Modern Web Technologies Full-Stack Academic Project · React, Express & MongoDB
          </div>
        </div>
      </footer>
    </div>
  );
}
