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
import { SidebarProvider } from '@/components/ui/sidebar';

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
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

    useEffect(() => {
        if (!loading && !user && !isAuthPage && pathname !== '/') {
            router.push('/login');
        }
    }, [user, loading, router, pathname, isAuthPage]);


    if (loading) {
        return (
             <div className="flex min-h-screen w-full bg-background items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Cpu className="h-12 w-12 text-primary animate-pulse" />
                  <p className="text-muted-foreground">Initializing Session...</p>
                </div>
            </div>
        );
    }

    if (!user && !isAuthPage && pathname !== '/') {
        return null; // or a specific "redirecting" component
    }
    
    return <>{children}</>;
}
