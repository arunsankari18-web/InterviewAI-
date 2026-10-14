import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminProtectedRoute } from './components/common/AdminProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { InterviewAIChatbot } from './components/common/InterviewAIChatbot';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GoogleAuthPage } from './pages/GoogleAuthPage';
import { Onboarding } from './pages/Onboarding';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// 8 Core Modules
import { CommandCenter } from './pages/CommandCenter';
import { CompanyIntelligence } from './pages/CompanyIntelligence';
import { InterviewStudio } from './pages/InterviewStudio';
import { ResumeDefense } from './pages/ResumeDefense';
import { TechnicalArena } from './pages/TechnicalArena';
import { InterviewAutopsy } from './pages/InterviewAutopsy';
import { PlacementReadiness } from './pages/PlacementReadiness';
import { ChallengeHub } from './pages/ChallengeHub';
import { ProfileSettings } from './pages/ProfileSettings';

function AppLayout({ children }) {
  const location = useLocation();
  const { t } = useLanguage();

  const getModuleTitle = () => {
    const p = location.pathname;
    if (p.includes('command-center')) return t('commandCenter');
    if (p.includes('company-intelligence')) return t('companyIntelligence');
    if (p.includes('interview-studio')) return t('interviewStudio');
    if (p.includes('resume-defense')) return t('resumeDefense');
    if (p.includes('technical-arena')) return t('technicalArena');
    if (p.includes('interview-autopsy')) return t('interviewAutopsy');
    if (p.includes('placement-readiness')) return t('placementReadiness');
    if (p.includes('challenge-hub')) return t('challengeHub');
    if (p.includes('profile')) return t('profileCalibration');
    return 'Placement Studio';
  };

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col font-sans">
      <Navbar activeModule={getModuleTitle()} />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <InterviewAIChatbot />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Candidate Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/google-auth" element={<GoogleAuthPage />} />

            {/* Admin Authentication & Control Dashboard */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Candidate Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* 8 Distinct Core Modules */}
            <Route
              path="/app/command-center"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CommandCenter />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/company-intelligence"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CompanyIntelligence />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/interview-studio"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <InterviewStudio />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/resume-defense"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ResumeDefense />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/technical-arena"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TechnicalArena />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/interview-autopsy"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <InterviewAutopsy />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/placement-readiness"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlacementReadiness />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/challenge-hub"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ChallengeHub />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfileSettings />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
