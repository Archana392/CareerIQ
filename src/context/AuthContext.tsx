import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, profile?: UserProfile) => void;
  logout: () => void;
  updateProfileState: (updated: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  loadDemoMode: () => Promise<void>;
  clearDemoMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('careeriq_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('careeriq_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          setProfile(res.profile);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          localStorage.removeItem('careeriq_token');
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        setToken(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = (newToken: string, newUser: User, newProfile?: UserProfile) => {
    localStorage.setItem('careeriq_token', newToken);
    setToken(newToken);
    setUser(newUser);
    if (newProfile) setProfile(newProfile);
  };

  const logout = () => {
    localStorage.removeItem('careeriq_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (updated: UserProfile) => {
    setProfile(updated);
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const p = await api.getProfile();
        setProfile(p);
      } catch (err) {
        console.error('Failed to refresh profile:', err);
      }
    }
  };

  const loadDemoMode = async () => {
    if (!token) {
      // If not logged in, log in with demo account
      const res = await api.login({ email: 'archana@careeriq.edu', password: 'CareerIQ@2026' });
      login(res.token, res.user, res.profile);
    } else {
      const res = await api.loadDemoData();
      if (res.profile) setProfile(res.profile);
      await refreshProfile();
    }
  };

  const clearDemoMode = async () => {
    if (token) {
      await api.clearDemoData();
      await refreshProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        logout,
        updateProfileState,
        refreshProfile,
        loadDemoMode,
        clearDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
