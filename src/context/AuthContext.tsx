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
  updateTargetRole: (newRole: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  loadDemoMode: () => Promise<void>;
  clearDemoMode: () => Promise<void>;
  loginAsGuest: () => Promise<{ success: boolean; sessionsLeft: number }>;
  guestSessionsLeft: number;
  isGuest: boolean;
  canUseGuest: boolean;
  promptGuestSignup: boolean;
  setPromptGuestSignup: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_GUEST_SESSIONS = 3;
const GUEST_KEY = 'careeriq_guest_uses_count';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('careeriq_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [guestUses, setGuestUses] = useState<number>(() => {
    const stored = localStorage.getItem(GUEST_KEY);
    return stored ? parseInt(stored, 10) || 0 : 0;
  });
  const [promptGuestSignup, setPromptGuestSignup] = useState<boolean>(false);

  const guestSessionsLeft = Math.max(0, MAX_GUEST_SESSIONS - guestUses);
  const isGuest = Boolean(user?.is_guest || user?.email?.includes('@careeriq.local'));
  const canUseGuest = guestSessionsLeft > 0;

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

  const updateTargetRole = async (newRole: string) => {
    if (!token) return;
    try {
      const updated = await api.updateProfile({ target_role: newRole });
      setProfile(updated);
    } catch (err) {
      console.error('Failed to update target role in profile:', err);
    }
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

  const loginAsGuest = async (): Promise<{ success: boolean; sessionsLeft: number }> => {
    if (guestUses >= MAX_GUEST_SESSIONS) {
      setPromptGuestSignup(true);
      return { success: false, sessionsLeft: 0 };
    }

    try {
      const res = await api.loginAsGuest();
      const newCount = guestUses + 1;
      localStorage.setItem(GUEST_KEY, newCount.toString());
      setGuestUses(newCount);

      const remaining = Math.max(0, MAX_GUEST_SESSIONS - newCount);
      const guestUser: User = {
        ...res.user,
        is_guest: true,
        guest_sessions_left: remaining
      };

      login(res.token, guestUser, res.profile);
      return { success: true, sessionsLeft: remaining };
    } catch (err) {
      console.error('Failed to log in as guest:', err);
      throw err;
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
        updateTargetRole,
        refreshProfile,
        loadDemoMode,
        clearDemoMode,
        loginAsGuest,
        guestSessionsLeft,
        isGuest,
        canUseGuest,
        promptGuestSignup,
        setPromptGuestSignup
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
