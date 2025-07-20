// src/hooks/use-auth.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingData } from '@/app/(app)/onboarding/page';

// Define a shape for our dummy user
// It now includes all the onboarding data fields.
export interface DummyUser extends Partial<OnboardingData> {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null; // Can be a URL or a Data URI
}

type AuthContextType = {
  user: DummyUser | null;
  loading: boolean;
  login: (userData: { email: string; displayName: string }) => void;
  logout: () => void;
  updateUser: (userData: DummyUser) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

const DUMMY_USER_STORAGE_KEY = 'dummyUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DummyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, try to get the user from localStorage
    try {
      const storedUser = localStorage.getItem(DUMMY_USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(DUMMY_USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: { email: string; displayName: string }) => {
    const dummyUser: DummyUser = {
      uid: 'dummy-uid-' + Math.random().toString(36).substring(2, 9),
      email: userData.email,
      displayName: userData.displayName,
    };
    localStorage.setItem(DUMMY_USER_STORAGE_KEY, JSON.stringify(dummyUser));
    setUser(dummyUser);
  };
  
  const updateUser = (userData: DummyUser) => {
    localStorage.setItem(DUMMY_USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(DUMMY_USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
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

export const useRequireAuth = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    return { user, loading };
};
