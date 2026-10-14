import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi, companyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  Video,
  Award,
  Activity,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Building2,
  Clock,
  Sparkles,
  RefreshCw,
  LogOut,
  FileText,
  AlertCircle,
  CheckCircle2,
  Eye,
  Mic,
  Cpu
} from 'lucide-react';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' | 'autopsies' | 'blueprints' | 'logs'
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteNotice, setDeleteNotice] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, candRes, intRes, compRes, logsRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getCandidates(),
        adminApi.getInterviews(),
        companyApi.getCompanies(),
        adminApi.getAuditLogs()
      ]);

      setMetrics(metricsRes.data.metrics);
      setCandidates(candRes.data.candidates || []);
      setInterviews(intRes.data.sessions || []);
      setCompanies(compRes.data.companies || []);
      setAuditLogs(logsRes.data.logs || []);
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to remove ${candidateName} from the placement roster?`)) {
      return;
    }
    try {
      await adminApi.deleteCandidate(candidateId);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      setDeleteNotice(`Candidate ${candidateName} was successfully removed.`);
      setTimeout(() => setDeleteNotice(null), 4000);
    } catch (err) {
      alert('Failed to delete candidate.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              🛡️
            </div>
            <div>
              <div className="font-display font-extrabold text-white text-base tracking-tight flex items-center space-x-2">
                <span>Interview AI</span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded uppercase">
                  Admin
                </span>
              </div>
            </div>
          </Link>
          <div className="hidden md:block text-slate-500 text-xs pl-4 border-l border-slate-800">
            Institutional Placement & Forensic Command Center
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Multi-lingual Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center space-x-1"
          >
            <span>🌐</span>
            <span>{language === 'en' ? 'English' : 'தமிழ்'}</span>
          </button>

          {/* Quick Refresh */}
          <button
            onClick={fetchDashboardData}
            title="Refresh Data"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Admin User Badge */}
          <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[10px] text-amber-400 font-mono">Role: Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-red-950/40 rounded-lg transition-colors border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        {deleteNotice && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{deleteNotice}</span>
          </div>
        )}

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Enrolled Candidates</span>
              <Users className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-3xl font-display font-extrabold text-white">
              {metrics?.totalCandidates ?? candidates.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
              <span>● 100% Verified Profiles</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Evaluated Interviews</span>
              <Video className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-display font-extrabold text-white">
              {metrics?.totalInterviews ?? interviews.length}
            </div>
            <div className="text-[11px] text-slate-400">
              Forensic recordings with Autopsy
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Average Campus Readiness</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-display font-extrabold text-white">
              {metrics?.avgReadinessScore ?? 82}%
            </div>
            <div className="text-[11px] text-amber-300/80">
              Tier 1 Placement Benchmark
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Behavioral Benchmarks</span>
              <Mic className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xs text-slate-300 font-mono space-y-0.5 pt-1">
              <div>Pace: <span className="font-bold text-white">{metrics?.behavioralAverages?.avgWpm ?? 126} WPM</span></div>
              <div>Eye Contact: <span className="font-bold text-emerald-400">{metrics?.behavioralAverages?.avgEyeContactPct ?? 88}%</span></div>
              <div>Filler Words: <span className="font-bold text-amber-400">{metrics?.behavioralAverages?.avgFillerWords ?? '2.8'}/session</span></div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'candidates'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🎓 Candidate Roster ({candidates.length})
            </button>
            <button
              onClick={() => setActiveTab('autopsies')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'autopsies'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🔍 Forensic Autopsies ({interviews.length})
            </button>
            <button
              onClick={() => setActiveTab('blueprints')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'blueprints'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏢 Company Blueprints ({companies.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⚡ Audit Logs
            </button>
          </div>

          {activeTab === 'candidates' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates or colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-64"
              />
            </div>
          )}
        </div>

        {/* TAB 1: CANDIDATES ROSTER */}
        {activeTab === 'candidates' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Institution & Degree</th>
                    <th className="py-3 px-4">Target Companies</th>
                    <th className="py-3 px-4">Readiness</th>
                    <th className="py-3 px-4">Interviews</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={cand.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cand.name)}`}
                            alt={cand.name}
                            className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-cover"
                          />
                          <div>
                            <div className="font-semibold text-white">{cand.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{cand.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{cand.college}</div>
                        <div className="text-[11px] text-slate-400">{cand.degree} ({cand.department}) · {cand.graduationYear}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cand.targetCompanies?.slice(0, 3).map((comp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300"
                            >
                              {comp.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold ${
                            cand.overallReadinessScore >= 80 ? 'text-emerald-400' :
                            cand.overallReadinessScore >= 70 ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {cand.overallReadinessScore}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                              style={{ width: `${cand.overallReadinessScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-mono font-semibold text-slate-300">
                          {cand.interviewCount} sessions
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCandidate(cand.id, cand.name)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                          title="Remove Candidate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FORENSIC INTERVIEWS ARCHIVE */}
        {activeTab === 'autopsies' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate & Company</th>
                    <th className="py-3 px-4">Round Type</th>
                    <th className="py-3 px-4">Overall Score</th>
                    <th className="py-3 px-4">Forensic Behavioral Analytics</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Autopsy Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {interviews.map((ses) => (
                    <tr key={ses.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{ses.candidateName || 'Candidate'}</div>
                        <div className="text-[11px] text-amber-400 flex items-center space-x-1">
                          <span>🏢 {ses.companyName}</span>
                          <span className="text-slate-500">· {ses.roleName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">
                          {ses.roundType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-bold text-emerald-400">
                          {ses.overallEvaluation?.overallScore ? `${ses.overallEvaluation.overallScore}%` : 'In Progress'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                          <div>Pace: <span className="text-white">{ses.behavioralMetrics?.speakingPaceWpm || 128} WPM</span></div>
                          <div>Eye Contact: <span className="text-emerald-400">{ses.behavioralMetrics?.eyeContactScore || 88}%</span></div>
                          <div>Fillers: <span className="text-amber-400">{ses.behavioralMetrics?.fillerWordCount || 3} words</span></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(ses.startedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/app/interview-autopsy?sessionId=${ses.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMPANY BLUEPRINTS */}
        {activeTab === 'blueprints' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div key={comp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{comp.logo || '🏢'}</span>
                    <div>
                      <h3 className="font-display font-bold text-white text-sm">{comp.name}</h3>
                      <div className="text-[11px] text-amber-400 font-medium">{comp.tier}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    comp.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {comp.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {comp.overview}
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-300 text-[11px]">Interview Elimination Structure:</div>
                  <div className="text-[11px] text-slate-400">
                    {comp.interviewRounds?.length || 5} Formal Rounds · Elimination rates up to 70%
                  </div>
                </div>

                <Link
                  to="/app/company-intelligence"
                  className="block text-center py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                >
                  View Blueprint Details →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="font-display font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Live System Audit Trail
            </div>
            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between space-x-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-[10px] text-amber-300 rounded font-semibold">
                        {log.type}
                      </span>
                      <span className="font-bold text-white text-xs">{log.event}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{log.details}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
