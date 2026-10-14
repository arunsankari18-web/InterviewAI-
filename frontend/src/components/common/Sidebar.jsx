import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Building2,
  Video,
  ShieldCheck,
  Code2,
  FileSearch,
  TrendingUp,
  Flame,
  UserCheck,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export function Sidebar() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  const MENU_ITEMS = [
    { path: '/app/command-center', name: t('commandCenter'), icon: LayoutDashboard },
    { path: '/app/company-intelligence', name: t('companyIntelligence'), icon: Building2 },
    { path: '/app/interview-studio', name: t('interviewStudio'), icon: Video },
    { path: '/app/resume-defense', name: t('resumeDefense'), icon: ShieldCheck },
    { path: '/app/technical-arena', name: t('technicalArena'), icon: Code2 },
    { path: '/app/interview-autopsy', name: t('interviewAutopsy'), icon: FileSearch },
    { path: '/app/placement-readiness', name: t('placementReadiness'), icon: TrendingUp },
    { path: '/app/challenge-hub', name: t('challengeHub'), icon: Flame }
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20 flex-shrink-0 font-sans">
      <div className="p-4 space-y-3 overflow-y-auto">
        {isAdmin && (
          <NavLink
            to="/admin/dashboard"
            className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 font-bold text-xs mb-3 hover:bg-amber-500/20 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{t('adminDashboard')}</span>
          </NavLink>
        )}

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-xs group ${
                    isActive
                      ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/90 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
            }`
          }
        >
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span>{t('profileCalibration')}</span>
        </NavLink>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
            <span>{t('targetRole')}</span>
            <span className="text-brand-600 font-bold">
              {profile?.targetCompanies?.[0]?.split(' ')[0] || 'Zoho'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {profile?.targetRoles?.[0] || 'Software Development Engineer'}
          </div>
        </div>
      </div>
    </aside>
  );
}
