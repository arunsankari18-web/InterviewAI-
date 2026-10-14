import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { readinessApi, interviewApi } from '../services/api';
import {
  Flame,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  Video,
  Code2,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { recordRecentAccess } from '../components/common/RecentlyAccessedDrawer';

export function CommandCenter() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [readinessData, setReadinessData] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recordRecentAccess({
      title: 'Placement Command Center',
      path: '/app/command-center',
      type: 'dashboard',
      icon: '🎯'
    });

    async function loadDashboard() {
      try {
        const [readinessRes, sessionsRes] = await Promise.all([
          readinessApi.getReadiness(),
          interviewApi.getSessions()
        ]);
        setReadinessData(readinessRes.data.readiness);
        setRecentSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.warn('Dashboard fetch notice:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const overallScore = readinessData?.overallReadiness ?? 0;
  const streak = readinessData?.streakDays || 1;
  const nextAction = readinessData?.nextBestAction || {
    title: "Complete Your First Placement Mock Interview",
    actionType: "studio",
    targetModule: "studio",
    reasoning: "Establish your diagnostic baseline across DSA, DBMS, and behavioral communication.",
    estimatedMinutes: 20
  };

  const trendData = recentSessions.length > 0 ? [
    { session: 'Start', score: 0 },
    ...recentSessions.slice(-4).map((s, idx) => ({
      session: s.companyName ? s.companyName.split(' ')[0] : `S${idx + 1}`,
      score: s.overallEvaluation?.overallScore || 50
    })),
    { session: 'Current', score: overallScore }
  ] : [
    { session: 'Base', score: 0 },
    { session: 'Target', score: 85 }
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeting <span className="font-semibold text-slate-800">{profile?.targetRoles?.[0] || 'Software Development Engineer'}</span> at{' '}
            <span className="font-semibold text-slate-800">{profile?.targetCompanies?.slice(0, 3).join(', ') || 'Zoho, TCS, Amazon'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{streak} Day Prep Streak</span>
          </div>

          <Link
            to="/app/interview-studio"
            className="flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Launch Studio</span>
          </Link>
        </div>
      </div>

      {/* Quick Jump: Recently Accessed Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
          <Clock className="w-4 h-4 text-brand-600" />
          <span>Recently Accessed Workspaces:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Link
            to="/app/company-intelligence"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl font-medium text-slate-700 hover:text-brand-700 transition-colors whitespace-nowrap"
          >
            <span>🏢</span>
            <span>Zoho & TCS Blueprints</span>
          </Link>
          <Link
            to="/app/resume-defense"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl font-medium text-slate-700 hover:text-brand-700 transition-colors whitespace-nowrap"
          >
            <span>🛡️</span>
            <span>Resume Defense Interrogation</span>
          </Link>
          <Link
            to="/app/technical-arena"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl font-medium text-slate-700 hover:text-brand-700 transition-colors whitespace-nowrap"
          >
            <span>💻</span>
            <span>Technical Arena Code Sandbox</span>
          </Link>
          <Link
            to="/app/interview-autopsy?sessionId=ses-autopsy-zoho-01"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl font-medium text-slate-700 hover:text-brand-700 transition-colors whitespace-nowrap"
          >
            <span>🔍</span>
            <span>Latest Forensic Autopsy</span>
          </Link>
        </div>
      </div>

      {/* Row 1: Readiness Score & Intelligent Next Best Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Readiness Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Placement Readiness</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                overallScore >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                overallScore >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-slate-100 text-slate-700'
              }`}>
                {overallScore >= 75 ? 'Ready' : overallScore >= 50 ? 'In Progress' : 'Onboarding'}
              </span>
            </div>
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-5xl font-display font-black text-slate-900">{overallScore}%</span>
              <span className="text-xs text-slate-500 font-medium">composite rating</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Target Benchmark: 85%</span>
              <span>{Math.max(0, 85 - overallScore)}% to target</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Intelligent Recommendation Card (Signature Feature) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-brand-50/70 via-white to-white border border-brand-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-brand-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Your Next Best Action</span>
            </div>
            <h2 className="text-lg font-display font-bold text-slate-900 leading-snug">
              {nextAction.title}
            </h2>
            <div className="p-3 bg-white/90 border border-brand-100 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Root Reason:</span>
              <p className="text-xs text-slate-600 leading-relaxed">{nextAction.reasoning}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-100/60">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Est. {nextAction.estimatedMinutes || 15} mins duration</span>
            </div>
            <Link
              to={nextAction.targetModule === 'arena' ? '/app/technical-arena' :
                  nextAction.targetModule === 'autopsy' ? '/app/interview-autopsy' :
                  nextAction.targetModule === 'defense' ? '/app/resume-defense' : '/app/interview-studio'}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              <span>Execute Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Skill Focus & Readiness Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strongest vs Weakest Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
            <Target className="w-4 h-4 text-brand-600" />
            <span>Skill Diagnostic Breakdown</span>
          </h2>

          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strongest Areas</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{profile?.skills?.[0] || 'Web Technologies & Frontend'}</span>
                  <span className="font-bold text-slate-900">{readinessData?.skillMatrix?.webTech?.score || (overallScore > 0 ? 80 : 0)}%</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{profile?.programmingLanguages?.[0] || 'Core OOP & Algorithms'}</span>
                  <span className="font-bold text-slate-900">{readinessData?.skillMatrix?.oop?.score || (overallScore > 0 ? 78 : 0)}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Priority Focus Gaps</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">DBMS & SQL Optimization</span>
                  <span className="font-bold text-rose-600">{readinessData?.skillMatrix?.dbms?.score || (overallScore > 0 ? 55 : 0)}%</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">System Design & Scalability</span>
                  <span className="font-bold text-rose-600">{readinessData?.skillMatrix?.systemDesign?.score || (overallScore > 0 ? 58 : 0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>Readiness Velocity Trend</span>
            </h2>
            <span className="text-xs font-medium text-slate-400">Last 5 Activities</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C85A32" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C85A32" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="session" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#C85A32" strokeWidth={2.5} fillOpacity={1} fill="url(#readinessGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Interview Sessions with Autopsy Links */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-display font-bold text-slate-900">Recent Interview Sessions</h2>
            <p className="text-xs text-slate-500">Review detailed autopsy forensics and replay recordings.</p>
          </div>
          <Link
            to="/app/interview-studio"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>Start New Session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
            <Video className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-700">No completed interviews yet</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Launch your first 15-minute diagnostic session in Interview Studio to generate your personalized Forensic Autopsy report.
            </p>
            <div className="pt-2">
              <Link
                to="/app/interview-studio"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-semibold hover:bg-brand-600 transition-colors"
              >
                <span>Launch First Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSessions.slice(0, 4).map((ses) => (
              <div key={ses.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900">{ses.companyName}</div>
                    <div className="text-[11px] text-slate-500">
                      {ses.roundType} Round · {new Date(ses.startedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">
                      {ses.overallEvaluation?.overallScore ? `${ses.overallEvaluation.overallScore}%` : 'In Progress'}
                    </div>
                    <div className="text-[10px] text-slate-400">Score</div>
                  </div>

                  <Link
                    to={`/app/interview-autopsy?sessionId=${ses.id}`}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center space-x-1"
                  >
                    <span>Autopsy</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
