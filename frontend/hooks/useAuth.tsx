'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { api, getStoredToken, setStoredToken } from '../services/api';
import { authClient } from '../lib/auth-client';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentToken = getStoredToken();
      if (currentToken) {
        setToken(currentToken);
        const profile = await api.auth.getMe();
        setUser(profile);
        return;
      }

      // Check Better Auth session for social logins
      const session = await authClient.getSession();
      if (session?.data?.user) {
        try {
          const profile = await api.auth.getMe();
          setUser(profile);
        } catch {
          setUser({
            id: session.data.user.id,
            name: session.data.user.name,
            email: session.data.user.email,
            role: 'user',
            isEmailVerified: session.data.user.emailVerified ?? true,
            notificationPreferences: {
              emailOnWin: true,
              emailOnNewDraw: true,
              inAppNotifications: true
            }
          });
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session refresh error:', err);
      setStoredToken(null);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.auth.login(credentials);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.auth.register(data);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {}
    setStoredToken(null);
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loading: isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser
      }}
    >
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
