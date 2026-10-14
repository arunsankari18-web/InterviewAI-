import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { RecentlyAccessedDrawer } from './RecentlyAccessedDrawer';
import { Target, LogOut, User, Bell, ChevronRight, ShieldCheck, Globe } from 'lucide-react';

export function Navbar({ activeModule = 'Command Center' }) {
  const { user, profile, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans">
      <div className="flex items-center space-x-4 sm:space-x-6">
        <Link to="/app/command-center" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-brand-600 transition-colors">
            🎯
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Interview AI
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-50 text-brand-700 px-1.5 py-0.2 rounded border border-brand-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              {t('tagline')}
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-2 text-slate-400 pl-4 border-l border-slate-200 text-xs font-medium">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">{activeModule}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Recently Accessed Dropdown Drawer */}
        <RecentlyAccessedDrawer />

        {/* Multi-Lingual Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
          title="Switch Language (English / தமிழ்)"
        >
          <Globe className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-[11px]">{language === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

        {/* Admin Dashboard Quick Link (if Admin) */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Portal</span>
          </Link>
        )}

        {/* Placement Readiness Pill (for candidates) */}
        {!isAdmin && (
          <Link
            to="/app/placement-readiness"
            className="hidden sm:flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors text-xs font-medium text-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">{t('readinessScore')}:</span>
            <span className="font-bold text-slate-900">
              {profile?.skills?.length ? '88%' : 'New'}
            </span>
          </Link>
        )}

        {/* User Pill & Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <Link
            to={isAdmin ? "/admin/dashboard" : "/app/profile"}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 object-cover"
            />
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-slate-800 truncate max-w-[110px]">{user?.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                {isAdmin ? 'Administrator' : (profile?.targetRoles?.[0] || 'Candidate')}
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title={t('signOut')}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
