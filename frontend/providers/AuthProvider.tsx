'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '@/types/auth';
import { loginApi, getMeApi } from '@/lib/api/auth';
import { setAuthToken, removeAuthToken, getAuthToken } from '@/lib/auth/cookies';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let pendingUserPromise: Promise<any> | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const token = getAuthToken();
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        if (!pendingUserPromise) {
          pendingUserPromise = getMeApi(token);
        }
        const response = await pendingUserPromise;
        if (!isMounted) return;

        if (response?.user) {
          setUser(response.user);
        } else {
          removeAuthToken();
          setUser(null);
        }
      } catch {
        if (!isMounted) return;
        removeAuthToken();
        setUser(null);
      } finally {
        pendingUserPromise = null;
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials);
    if (response?.token) {
      setAuthToken(response.token);
      setUser(response.user);
      router.push('/dashboard');
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
