'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from './types';
import { mockUsers } from './mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const SESSION_KEY = 'vanto_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      try {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
          const userData = JSON.parse(session);
          const foundUser = mockUsers.find((u) => u.id === userData.id);
          if (foundUser) {
            setUser(foundUser);
          }
        }
      } catch (e) {
        console.error('Session check failed:', e);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email (in real app, would validate password)
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser && password.length >= 4) {
      setUser(foundUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: foundUser.id }));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
