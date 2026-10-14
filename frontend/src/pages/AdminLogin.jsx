import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Account authenticated, but does not possess administrator privileges.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillAdmin = () => {
    setEmail('admin@interviewai.dev');
    setPassword('Admin@123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white font-sans relative overflow-hidden">
      {/* Background aesthetic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-500/20">
            🛡️
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight text-white">
            Interview AI
          </span>
        </Link>
        <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Admin Portal</span>
        </div>
        <h2 className="mt-3 text-2xl font-display font-bold text-white">
          Placement Administration Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Access the campus candidate roster, forensic autopsy archives, and evaluation analytics.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start space-x-2 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <div className="font-semibold text-amber-200">Evaluation Mode</div>
                <div className="text-[10px] text-slate-400">admin@interviewai.dev</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFillAdmin}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[11px] font-bold transition-colors shadow-xs"
            >
              Auto-Fill Credentials
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Officer Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@interviewai.dev"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <span>Enter Administrator Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Candidate Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
