"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // last known user, for display only while /auth/me is in flight
  cachedUser: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_HINT_KEY = 'lms:user-hint';

const saveUserHint = (u: User | null) => {
  try {
    if (u) localStorage.setItem(USER_HINT_KEY, JSON.stringify({ id: u.id, email: u.email, role: u.role }));
    else localStorage.removeItem(USER_HINT_KEY);
  } catch {
    // storage unavailable (private mode) — the hint is optional
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cachedUser, setCachedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_HINT_KEY);
      if (raw) setCachedUser(JSON.parse(raw));
    } catch {
      saveUserHint(null);
    }

    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
          saveUserHint({ ...response.data.data, id: response.data.data._id ?? response.data.data.id });
        }
      } catch (error: any) {
        // 401/404 just means not logged in
        if (error.response?.status === 401 || error.response?.status === 404) {
          saveUserHint(null);
          setCachedUser(null);
        } else {
          console.error('Failed to fetch user', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (token: string, userData: User) => {
    // auth cookie is set by the server, not here
    setUser(userData);
    saveUserHint(userData);
  };

  const logout = async () => {
    // don't wait on the API — update the UI right away
    const request = api.post('/auth/logout').catch((error) => console.error('Logout error', error));
    setUser(null);
    setCachedUser(null);
    saveUserHint(null);
    router.push('/login');
    await request;
  };

  return (
    <AuthContext.Provider value={{ user, loading, cachedUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
