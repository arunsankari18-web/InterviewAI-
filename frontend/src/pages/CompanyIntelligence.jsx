import React, { useState, useEffect } from 'react';
import { companyApi } from '../services/api';
import {
  Building2,
  Layers,
  CheckCircle2,
  Code2,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Award,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

import { recordRecentAccess } from '../components/common/RecentlyAccessedDrawer';

export function CompanyIntelligence() {
  const [companies, setCompanies] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('zoho');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [reportedQuestions, setReportedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comparison State
  const [showComparison, setShowComparison] = useState(false);
  const [compA, setCompA] = useState('zoho');
  const [compB, setCompB] = useState('tcs');
  const [comparisonData, setComparisonData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await companyApi.getCompanies();
        setCompanies(res.data.companies || []);
      } catch (err) {
        console.warn('Companies fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    async function loadDetails() {
      if (!selectedSlug) return;
      try {
        const res = await companyApi.getCompanyBySlug(selectedSlug);
        setCompanyDetails(res.data.company);
        setReportedQuestions(res.data.reportedQuestions || []);

        if (res.data.company) {
          recordRecentAccess({
            title: `${res.data.company.name} Blueprint`,
            path: `/app/company-intelligence`,
            type: 'company',
            icon: res.data.company.logo || '🏢'
          });
        }
      } catch (err) {
        console.warn('Company detail fetch error:', err);
      }
    }
    loadDetails();
  }, [selectedSlug]);

  const handleCompare = async () => {
    setCompareLoading(true);
    try {
      const res = await companyApi.compareCompanies(compA, compB);
      setComparisonData(res.data);
      setShowComparison(true);
    } catch (err) {
      console.warn('Comparison fetch error:', err);
    } finally {
      setCompareLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-64 bg-slate-200 rounded-2xl md:col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Placement Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Company Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified interview blueprints, reported questions, round breakdown, and side-by-side hiring matrices.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setShowComparison(!showComparison);
              if (!showComparison) handleCompare();
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showComparison
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{showComparison ? 'Hide Comparison' : 'Compare Companies'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Modal / Bar when Active */}
      {showComparison && (
        <div className="bg-white border border-brand-200 rounded-2xl p-6 shadow-md space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚖️</span>
              <h2 className="text-sm font-display font-bold text-slate-900">
                Company Hiring Blueprint Comparison
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={compA}
                onChange={(e) => setCompA(e.target.value)}
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                {companies.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <span className="text-xs font-bold text-slate-400">VS</span>
              <select
                value={compB}
                onChange={(e) => setCompB(e.target.value)}
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                {companies.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <button
                onClick={handleCompare}
                disabled={compareLoading}
                className="px-3 py-1.5 bg-brand-500 text-white text-xs font-semibold rounded-xl hover:bg-brand-600"
              >
                Compare
              </button>
            </div>
          </div>

          {comparisonData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Company A */}
              <div className="p-4 bg-brand-50/40 border border-brand-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                  <span>{comparisonData.companyA.name}</span>
                  <span className="text-brand-600">{comparisonData.companyA.difficulty}</span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between"><span>Coding Intensity:</span> <span className="font-bold">{comparisonData.matrix.codingIntensity.a}%</span></div>
                  <div className="flex justify-between"><span>Technical Depth:</span> <span className="font-bold">{comparisonData.matrix.technicalDepth.a}%</span></div>
                  <div className="flex justify-between"><span>CS Core Weight:</span> <span className="font-bold">{comparisonData.matrix.csCoreWeight.a}%</span></div>
                  <div className="flex justify-between"><span>Behavioral Weight:</span> <span className="font-bold">{comparisonData.matrix.behavioralWeight.a}%</span></div>
                  <div className="flex justify-between"><span>Rounds Count:</span> <span className="font-bold">{comparisonData.matrix.roundsCount.a} Rounds</span></div>
                </div>
              </div>

              {/* Company B */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                  <span>{comparisonData.companyB.name}</span>
                  <span className="text-slate-700">{comparisonData.companyB.difficulty}</span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between"><span>Coding Intensity:</span> <span className="font-bold">{comparisonData.matrix.codingIntensity.b}%</span></div>
                  <div className="flex justify-between"><span>Technical Depth:</span> <span className="font-bold">{comparisonData.matrix.technicalDepth.b}%</span></div>
                  <div className="flex justify-between"><span>CS Core Weight:</span> <span className="font-bold">{comparisonData.matrix.csCoreWeight.b}%</span></div>
                  <div className="flex justify-between"><span>Behavioral Weight:</span> <span className="font-bold">{comparisonData.matrix.behavioralWeight.b}%</span></div>
                  <div className="flex justify-between"><span>Rounds Count:</span> <span className="font-bold">{comparisonData.matrix.roundsCount.b} Rounds</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Exploration Layout: Sidebar of Companies + Detail Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Company Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Select Company
          </div>
          <div className="space-y-2">
            {companies.map((comp) => {
              const isSelected = selectedSlug === comp.slug;
              return (
                <button
                  key={comp.slug}
                  onClick={() => setSelectedSlug(comp.slug)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-white border-brand-400 shadow-sm ring-2 ring-brand-500/10'
                      : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{comp.logo || '🏢'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {comp.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                      <span className="font-semibold px-1.5 py-0.2 bg-slate-100 rounded text-slate-700">{comp.difficulty}</span>
                      <span>{comp.tier}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Company Blueprint & Reported Questions */}
        {companyDetails && (
          <div className="lg:col-span-3 space-y-6">
            {/* Overview Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{companyDetails.logo || '🏢'}</span>
                    <h2 className="text-xl font-display font-extrabold text-slate-900">
                      {companyDetails.name}
                    </h2>
                    <span className="text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-md">
                      {companyDetails.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {companyDetails.overview}
                  </p>
                </div>
              </div>

              {/* Blueprint Radar / Bar Matrix */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Company Interview Blueprint Matrix
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Coding Intensity', val: companyDetails.blueprint.codingIntensity, color: 'bg-rose-500' },
                    { label: 'Technical Depth', val: companyDetails.blueprint.technicalDepth, color: 'bg-indigo-500' },
                    { label: 'Problem Solving', val: companyDetails.blueprint.problemSolvingWeight, color: 'bg-amber-500' },
                    { label: 'CS Core (DBMS/OS)', val: companyDetails.blueprint.csCoreWeight, color: 'bg-emerald-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>{stat.label}</span>
                        <span className="text-slate-900 font-bold">{stat.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Topics */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 mr-1">Top Focus Areas:</span>
                {companyDetails.blueprint.topFocusAreas?.map((area, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-brand-50 border border-brand-200 text-brand-800 rounded-lg text-[11px] font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Rounds Sequence */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Standard Placement Elimination Rounds</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companyDetails.interviewRounds?.map((round) => (
                  <div key={round.roundNumber} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{round.name}</span>
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                        Elimination ~ {round.eliminationRate}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{round.description}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{round.durationMinutes} minutes duration</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reported Questions Bank */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-brand-600" />
                    <span>Reported Questions & Patterns</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparently labeled with verified placement sources.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {reportedQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No verified questions listed for this company filter yet.</p>
                ) : (
                  reportedQuestions.map((q) => (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          q.sourceType.includes('Verified') ? 'bg-emerald-100 text-emerald-800' :
                          q.sourceType.includes('Pattern') ? 'bg-indigo-100 text-indigo-800' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {q.sourceType}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          {q.sourceMetadata?.reportedBy} · {q.sourceMetadata?.reportingPeriod}
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-900 leading-snug">
                        {q.questionText}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                        <span className="text-slate-400 font-semibold">Expected Concepts:</span>
                        {q.expectedConcepts?.map((c, i) => (
                          <span key={i} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
