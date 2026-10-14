import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function AdminProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-white text-sm">
          <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Administrative Session Credentials...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display">Administrator Access Restricted</h1>
        <p className="text-slate-400 text-xs max-w-md mt-2 mb-6">
          You are currently signed in as <span className="font-semibold text-white">{user.name}</span> ({user.role}). Only verified Placement Officers and Administrators can access the evaluation dashboard.
        </p>
        <a
          href="/app/command-center"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Candidate Command Center</span>
        </a>
      </div>
    );
  }

  return children;
}
