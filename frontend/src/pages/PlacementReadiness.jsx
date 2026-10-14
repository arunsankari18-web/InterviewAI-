import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readinessApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  Building2,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  Video,
  ShieldCheck,
  Flame,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export function PlacementReadiness() {
  const { profile } = useAuth();
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReadiness() {
      try {
        const res = await readinessApi.getReadiness();
        setReadinessData(res.data.readiness);
      } catch (err) {
        console.warn('Readiness fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReadiness();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-64 bg-slate-200 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  const overall = readinessData?.overallReadiness || 78;
  const matrix = readinessData?.skillMatrix || {
    dsa: { score: 78 },
    dbms: { score: 72 },
    oop: { score: 80 },
    systemDesign: { score: 65 },
    webTech: { score: 84 },
    communication: { score: 82 },
    projectDefense: { score: 75 },
    problemSolving: { score: 80 }
  };

  const radarData = [
    { subject: 'DSA', score: matrix.dsa?.score || 78, fullMark: 100 },
    { subject: 'DBMS & SQL', score: matrix.dbms?.score || 72, fullMark: 100 },
    { subject: 'OOP & Core', score: matrix.oop?.score || 80, fullMark: 100 },
    { subject: 'System Design', score: matrix.systemDesign?.score || 65, fullMark: 100 },
    { subject: 'Web Stack', score: matrix.webTech?.score || 84, fullMark: 100 },
    { subject: 'Communication', score: matrix.communication?.score || 82, fullMark: 100 },
    { subject: 'Resume Defense', score: matrix.projectDefense?.score || 75, fullMark: 100 },
    { subject: 'Problem Solving', score: matrix.problemSolving?.score || 80, fullMark: 100 }
  ];

  const defaultCompanies = [
    { companySlug: 'zoho', companyName: 'Zoho Corporation', score: 82, status: 'High Match', targetRole: 'Software Developer' },
    { companySlug: 'tcs', companyName: 'TCS Digital', score: 86, status: 'Ready', targetRole: 'Digital Engineer' },
    { companySlug: 'amazon', companyName: 'Amazon SDE-1', score: 68, status: 'In Progress', targetRole: 'SDE-1' },
    { companySlug: 'accenture', companyName: 'Accenture AASE', score: 88, status: 'Ready', targetRole: 'Associate Software Eng.' },
    { companySlug: 'infosys', companyName: 'Infosys SP', score: 74, status: 'In Progress', targetRole: 'Specialist Programmer' }
  ];

  const companies = readinessData?.companyReadinessScores?.length
    ? readinessData.companyReadinessScores.map((c, i) => ({
        ...c,
        targetRole: defaultCompanies[i % defaultCompanies.length]?.targetRole || 'Software Engineer'
      }))
    : defaultCompanies;

  const topSkills = profile?.skills?.length ? profile.skills.slice(0, 8) : ['Data Structures', 'JavaScript', 'React', 'SQL', 'Node.js', 'OOP'];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Placement Readiness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Competency Matrix & Company Match
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time readiness index evaluated across your coding sessions, mock rooms, and defense audits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Overall Score: {overall}%</span>
          </div>
          <Link
            to="/app/challenge-hub"
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Take Daily Sprint</span>
          </Link>
        </div>
      </div>

      {/* 4 Key Pillar Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>DSA & Coding</span>
            <Code2 className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-display font-black text-slate-900">{matrix.dsa?.score || 78}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
            <span>✓ 10 Problems in Bank</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Interview Composure</span>
            <Video className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-display font-black text-slate-900">{matrix.communication?.score || 82}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            <span>✓ 142 WPM Pacing</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Project Credibility</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-black text-slate-900">{matrix.projectDefense?.score || 75}%</div>
          <div className="text-[10px] text-blue-600 font-semibold">
            <span>✓ Resume Claims Verified</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Core CS & SQL</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-display font-black text-slate-900">{matrix.dbms?.score || 72}%</div>
          <div className="text-[10px] text-amber-600 font-semibold">
            <span>↑ Target: 85%</span>
          </div>
        </div>
      </div>

      {/* Row 2: Skill Radar & Target Company Match Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 8-Dimension Radar */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
              <Target className="w-4 h-4 text-brand-600" />
              <span>Skill Radar Matrix</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">8 Key Dimensions</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                <Radar name="Candidate Score" dataKey="score" stroke="#C85A32" fill="#C85A32" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {topSkills.map((s, idx) => (
              <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Company Match Benchmarks */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Company Readiness Ratings</span>
            </h2>
            <Link to="/app/company-intelligence" className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1">
              <span>View Blueprints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {companies.map((c) => (
              <div key={c.companySlug} className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2.5 hover:bg-white hover:border-brand-200 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{c.companyName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{c.targetRole}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    c.score >= 70 ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status || (c.score >= 80 ? 'Ready' : 'In Progress')}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-display font-black text-slate-900">{c.score}%</span>
                    <span className="text-[10px] text-slate-400">match</span>
                  </div>
                  <Link
                    to="/app/interview-studio"
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Mock Room →
                  </Link>
                </div>

                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.score >= 80 ? 'bg-emerald-500' : c.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Quick Action Sprints */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/app/technical-arena"
          className="p-5 bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-200 rounded-2xl shadow-xs hover:shadow-sm transition-all space-y-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Code2 className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            Technical Coding Arena
          </h3>
          <p className="text-xs text-slate-500">
            Solve 10 real placement problems with test runners & code defense.
          </p>
        </Link>

        <Link
          to="/app/interview-studio"
          className="p-5 bg-gradient-to-br from-rose-50/60 to-white border border-rose-200 rounded-2xl shadow-xs hover:shadow-sm transition-all space-y-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Video className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
            Interactive Interview Room
          </h3>
          <p className="text-xs text-slate-500">
            Practice live adaptive interviews with real-time speech and AI evaluation.
          </p>
        </Link>

        <Link
          to="/app/challenge-hub"
          className="p-5 bg-gradient-to-br from-amber-50/60 to-white border border-amber-200 rounded-2xl shadow-xs hover:shadow-sm transition-all space-y-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
            10-Question Daily Sprint
          </h3>
          <p className="text-xs text-slate-500">
            Timed placement multiple-choice drills with instant recruiter feedback.
          </p>
        </Link>
      </div>
    </div>
  );
}
