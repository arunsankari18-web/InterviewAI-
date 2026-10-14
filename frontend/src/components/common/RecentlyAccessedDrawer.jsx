import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, ChevronDown, ExternalLink, X, Building2, Video, Code2, ShieldCheck, FileSearch, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STORAGE_KEY = 'interview_ai_recents';

// Helper to record an accessed module/page
export function recordRecentAccess(item) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let items = raw ? JSON.parse(raw) : [];

    // Filter out duplicate path
    items = items.filter(i => i.path !== item.path);

    // Prepend new item
    items.unshift({
      ...item,
      timestamp: Date.now()
    });

    // Keep max 8
    items = items.slice(0, 8);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('recents_updated'));
  } catch (e) {
    console.warn('Recent access write error:', e);
  }
}

export function RecentlyAccessedDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [recents, setRecents] = useState([]);
  const dropdownRef = useRef(null);
  const { t } = useLanguage();
  const location = useLocation();

  const loadRecents = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setRecents(JSON.parse(raw));
      } else {
        // Initialize default quick links
        const defaults = [
          { title: 'Zoho Corporation Blueprint', path: '/app/company-intelligence', type: 'company', icon: '🏢' },
          { title: 'Interview Autopsy - Zoho SDE', path: '/app/interview-autopsy?sessionId=ses-autopsy-zoho-01', type: 'autopsy', icon: '🔍' },
          { title: 'Resume Defense Studio', path: '/app/resume-defense', type: 'resume', icon: '🛡️' },
          { title: 'Technical Arena - Hash Maps', path: '/app/technical-arena', type: 'code', icon: '💻' }
        ];
        setRecents(defaults);
      }
    } catch (e) {
      setRecents([]);
    }
  };

  useEffect(() => {
    loadRecents();
    const handleUpdate = () => loadRecents();
    window.addEventListener('recents_updated', handleUpdate);
    return () => window.removeEventListener('recents_updated', handleUpdate);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearRecents = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecents([]);
  };

  const formatTime = (ts) => {
    if (!ts) return 'Recent';
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
        title="Recently Accessed Items"
      >
        <Clock className="w-3.5 h-3.5 text-brand-600" />
        <span className="hidden md:inline">{t('recentlyAccessed')}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-slate-900">{t('recentlyAccessed')}</span>
            </div>
            {recents.length > 0 && (
              <button
                onClick={clearRecents}
                className="text-[11px] text-slate-400 hover:text-red-600 font-medium transition-colors"
              >
                {t('clear')}
              </button>
            )}
          </div>

          {recents.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No recent items visited yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {recents.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-base flex-shrink-0">{item.icon || '📌'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.type || 'module'} · {formatTime(item.timestamp)}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-brand-600 flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
