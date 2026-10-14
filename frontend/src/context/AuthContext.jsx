import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, profileApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('interview_ai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('interview_ai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then(res => {
          setUser(res.data.user);
          setProfile(res.data.profile);
          localStorage.setItem('interview_ai_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: jwtToken, user: userData, profile: profileData, onboardingCompleted } = res.data;
    localStorage.setItem('interview_ai_token', jwtToken);
    localStorage.setItem('interview_ai_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setProfile(profileData);
    return { user: userData, onboardingCompleted };
  };

  const googleLogin = async (googleUser) => {
    const res = await authApi.googleLogin(googleUser);
    const { token: jwtToken, user: userData, profile: profileData, onboardingCompleted } = res.data;
    localStorage.setItem('interview_ai_token', jwtToken);
    localStorage.setItem('interview_ai_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setProfile(profileData);
    return { user: userData, onboardingCompleted };
  };

  const register = async (name, email, password, confirmPassword) => {
    // Returns response from register endpoint without auto-logging in!
    return await authApi.register({ name, email, password, confirmPassword });
  };

  const logout = () => {
    localStorage.removeItem('interview_ai_token');
    localStorage.removeItem('interview_ai_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      token,
      loading,
      login,
      googleLogin,
      register,
      logout,
      updateProfileState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
