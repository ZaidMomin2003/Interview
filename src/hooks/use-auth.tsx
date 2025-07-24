// src/hooks/use-auth.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  OAuthProvider,
  type User as FirebaseUser
} from "firebase/auth";
import { Skeleton } from '@/components/ui/skeleton';

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

// A simplified AuthGuard. It protects a route, and shows a loading skeleton.
// The data-specific loading and onboarding checks are handled by other components.
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/calculate-salary') {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);


    if (loading || (!user && pathname !== '/calculate-salary' && pathname !== '/')) {
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
