// src/hooks/use-auth.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingData } from '@/app/(app)/onboarding/page';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
  GithubAuthProvider,
  OAuthProvider
} from "firebase/auth";
import { useUserData } from './use-user-data';

// This will now only hold the core Firebase User object properties
export interface CoreUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type AuthContextType = {
  user: CoreUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithLinkedin: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // updateUser is now removed from here, it will be in useUserData
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithGithub: async () => {},
  loginWithLinkedin: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in. We only store the core Firebase info here.
        // The rest of the user's data will come from the useUserData hook.
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  
  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };
  
  const loginWithLinkedin = async () => {
     const provider = new OAuthProvider('linkedin.com');
     await signInWithPopup(auth, provider);
  };


  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }

  const signupWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    await signOut(auth);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithGithub, loginWithLinkedin, loginWithEmail, signupWithEmail, logout }}>
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

// AuthGuard no longer needs a useRequireAuth hook, it can be simplified.
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // We also check the user data from useUserData to ensure the profile is loaded.
    const { profile } = useUserData();

    if (loading || !user || !profile) {
        return (
             <div className="flex min-h-screen w-full bg-background">
                <div className="hidden md:flex flex-col gap-4 p-2 border-r border-border bg-secondary/30 w-64">
                <div className="p-2 flex items-center gap-2"><Skeleton className="h-10 w-10 rounded-full bg-muted" /><Skeleton className="h-6 w-32 bg-muted" /></div>
                <div className="p-2 space-y-2">
                    <Skeleton className="h-8 w-full bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                </div>
                </div>
                <div className="flex-1 p-8">
                    <Skeleton className="h-12 w-1/2 mb-4 bg-muted" />
                    <Skeleton className="h-8 w-3/4 mb-8 bg-muted" />
                    <Skeleton className="h-64 w-full bg-muted" />
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
}
