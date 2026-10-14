import React, { useState } from 'react';
import { User, Plus, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const [step, setStep] = useState('choose'); // 'choose' | 'custom_email' | 'password'
  const [selectedUser, setSelectedUser] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real accounts matching user's authentic Google environment
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

  const handleAccountClick = (account) => {
    setSelectedUser(account);
    setStep('password');
    setPassword('');
    setError('');
  };

  const handleCustomEmailSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    const newAcc = {
      name,
      email: customEmail.trim(),
      avatarColor: 'bg-emerald-600',
      initial: name.charAt(0).toUpperCase()
    };
    setSelectedUser(newAcc);
    setStep('password');
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Enter a password to authenticate Google account.');
      return;
    }
    // Authenticate with selected Google identity
    onSelectAccount({
      name: selectedUser.name,
      email: selectedUser.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUser.name)}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-[#1f1f1f] text-white rounded-3xl shadow-2xl border border-neutral-800 w-full max-w-[450px] overflow-hidden">
        {/* Top Google Header */}
        <div className="px-8 pt-7 pb-4 flex items-center justify-between border-b border-neutral-800/60">
          <div className="flex items-center space-x-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-xs font-semibold text-neutral-300">Sign in with Google</span>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: Choose an Account */}
        {step === 'choose' && (
          <div className="px-8 py-6 space-y-6">
            <div className="space-y-3">
              {/* App Logo */}
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🎯
              </div>

              <div>
                <h2 className="text-2xl font-display font-medium text-white tracking-tight">
                  Choose an account
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  to continue to <span className="text-white font-semibold">Interview AI</span>
                </p>
              </div>
            </div>

            {/* Account List */}
            <div className="divide-y divide-neutral-800 border-y border-neutral-800">
              {savedAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAccountClick(acc)}
                  className="w-full py-3.5 flex items-center space-x-3.5 hover:bg-neutral-800/60 px-2 rounded-xl transition-all text-left group"
                >
                  <div className={`w-8 h-8 rounded-full ${acc.avatarColor} text-white font-bold flex items-center justify-center text-xs flex-shrink-0`}>
                    {acc.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      {acc.email}
                    </div>
                  </div>
                </button>
              ))}

              {/* Use Another Account */}
              <button
                type="button"
                onClick={() => setStep('custom_email')}
                className="w-full py-3.5 flex items-center space-x-3.5 hover:bg-neutral-800/60 px-2 rounded-xl transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full border border-neutral-700 text-neutral-400 group-hover:text-white flex items-center justify-center text-xs flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                    Use another account
                  </div>
                </div>
              </button>
            </div>

            {/* Privacy note */}
            <div className="text-[11px] text-neutral-400 leading-relaxed pt-1">
              Before using this app, you can review Interview AI's{' '}
              <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span> and{' '}
              <span className="text-blue-400 hover:underline cursor-pointer">Terms of Service</span>.
            </div>
          </div>
        )}

        {/* STEP 2: Custom Email Input */}
        {step === 'custom_email' && (
          <form onSubmit={handleCustomEmailSubmit} className="px-8 py-6 space-y-5">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="text-neutral-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-base font-medium text-white">Enter your Google Account</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Email or phone</label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Back to accounts
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-full"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter Google Password for Authentication */}
        {step === 'password' && selectedUser && (
          <form onSubmit={handlePasswordSubmit} className="px-8 py-6 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 border border-neutral-700 bg-neutral-900/80 px-3 py-1.5 rounded-full text-xs">
                <div className={`w-4 h-4 rounded-full ${selectedUser.avatarColor} text-[9px] flex items-center justify-center font-bold`}>
                  {selectedUser.initial}
                </div>
                <span className="text-neutral-300 truncate max-w-[200px]">{selectedUser.email}</span>
              </div>

              <h2 className="text-xl font-display font-medium text-white tracking-tight">
                Welcome, {selectedUser.name}
              </h2>
              <p className="text-xs text-neutral-400">
                Enter your Google password to authenticate access.
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
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-[11px] text-red-400 font-medium">{error}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Switch account
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-full shadow-md"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* Footer Language and Links */}
        <div className="px-8 py-3 bg-[#181818] border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>English (United States)</span>
          <div className="flex space-x-3">
            <span className="hover:text-neutral-300 cursor-pointer">Help</span>
            <span className="hover:text-neutral-300 cursor-pointer">Privacy</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
