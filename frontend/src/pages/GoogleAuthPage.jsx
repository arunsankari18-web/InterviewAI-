import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function GoogleAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const [step, setStep] = useState('choose'); // 'choose' | 'custom' | 'password'
  const [selectedUser, setSelectedUser] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Accounts matching user's Google accounts from screenshot
  const savedAccounts = [
    {
      name: 'BALA NITHYA M IT-2024',
      email: '24205039@nec.edu.in',
      avatarColor: 'bg-orange-600',
      initial: 'B'
    },
    {
      name: 'Balanithya',
      email: 'balanithyam04@gmail.com',
      avatarColor: 'bg-blue-600',
      initial: 'B'
    }
  ];

  const handleSelectSavedAccount = (acc) => {
    setSelectedUser(acc);
    setStep('password');
    setPassword('');
    setError('');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    const acc = {
      name,
      email: customEmail.trim(),
      avatarColor: 'bg-emerald-600',
      initial: name.charAt(0).toUpperCase()
    };
    setSelectedUser(acc);
    setStep('password');
    setPassword('');
    setError('');
  };

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your Google password.');
      return;
    }

    setLoading(true);
    try {
      const res = await googleLogin({
        name: selectedUser.name,
        email: selectedUser.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUser.name)}`,
        googleId: `g-${selectedUser.email}`
      });

      if (res.onboardingCompleted) {
        navigate('/app/command-center');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Google Branding */}
      <div className="p-6 sm:px-12 flex items-center space-x-2.5">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span className="text-sm font-medium text-neutral-300">Sign in with Google</span>
      </div>

      {/* Center Box Replicating Screenshot 3 */}
      <div className="max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-[#1f1f20] border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {step === 'choose' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  🎯
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
                    Choose an account
                  </h1>
                  <p className="text-sm text-neutral-400 mt-2">
                    to continue to <span className="text-blue-400 font-semibold">Interview AI</span>
                  </p>
                </div>
              </div>

              {/* Right Column: Account List */}
              <div className="space-y-4">
                <div className="divide-y divide-neutral-800 border-y border-neutral-800">
                  {savedAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSavedAccount(acc)}
                      className="w-full py-4 flex items-center space-x-4 hover:bg-neutral-800/60 px-3 rounded-2xl transition-all text-left group"
                    >
                      <div className={`w-10 h-10 rounded-full ${acc.avatarColor} text-white font-bold flex items-center justify-center text-sm flex-shrink-0`}>
                        {acc.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-neutral-100 group-hover:text-white truncate">
                          {acc.name}
                        </div>
                        <div className="text-xs text-neutral-400 truncate">
                          {acc.email}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Use Another Account */}
                  <button
                    type="button"
                    onClick={() => setStep('custom')}
                    className="w-full py-4 flex items-center space-x-4 hover:bg-neutral-800/60 px-3 rounded-2xl transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 group-hover:text-white flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-200 group-hover:text-white">
                        Use another account
                      </div>
                    </div>
                  </button>
                </div>

                <div className="text-xs text-neutral-400 leading-relaxed pt-2">
                  Before using this app, you can review Interview AI's{' '}
                  <span className="text-blue-400 hover:underline cursor-pointer font-semibold">Privacy Policy</span> and{' '}
                  <span className="text-blue-400 hover:underline cursor-pointer font-semibold">Terms of Service</span>.
                </div>
              </div>
            </div>
          )}

          {step === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="max-w-md mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-medium text-white">Sign in with Google</h2>
                  <p className="text-xs text-neutral-400">Use your Google Account</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Bala Nithya M"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Email or phone</label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="24205039@nec.edu.in"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Back to accounts
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-full"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 'password' && selectedUser && (
            <form onSubmit={handleAuthenticate} className="max-w-md mx-auto space-y-6 animate-fade-in">
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center space-x-2 border border-neutral-700 bg-neutral-900/90 px-3.5 py-1.5 rounded-full text-xs mx-auto">
                  <div className={`w-4 h-4 rounded-full ${selectedUser.avatarColor} text-[10px] flex items-center justify-center font-bold text-white`}>
                    {selectedUser.initial}
                  </div>
                  <span className="text-neutral-200">{selectedUser.email}</span>
                </div>

                <h2 className="text-2xl font-display font-medium text-white tracking-tight pt-2">
                  Welcome, {selectedUser.name}
                </h2>
                <p className="text-xs text-neutral-400">
                  Enter your Google account password to authenticate.
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Switch account
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-full disabled:opacity-60 shadow-md"
                >
                  {loading ? 'Authenticating...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 border-t border-neutral-800/40">
        <div>English (United States)</div>
        <div className="flex space-x-6">
          <span className="hover:text-neutral-300 cursor-pointer">Help</span>
          <span className="hover:text-neutral-300 cursor-pointer">Privacy</span>
          <span className="hover:text-neutral-300 cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );
}
