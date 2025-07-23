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
  updateProfile,
  type User as FirebaseUser
} from "firebase/auth";

// Combine Firebase User with our custom onboarding data
export interface AppUser extends Partial<OnboardingData> {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<OnboardingData>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateUser: async () => {},
});

const USER_PROFILE_STORAGE_PREFIX = 'userProfile_';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        const profileData = localStorage.getItem(`${USER_PROFILE_STORAGE_PREFIX}${firebaseUser.uid}`);
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...(profileData ? JSON.parse(profileData) : {})
        };
        setUser(appUser);
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will handle setting the user state.
  };

  const logout = async () => {
    await signOut(auth);
     // onAuthStateChanged will handle setting the user state to null.
  };
  
  const updateUser = async (data: Partial<OnboardingData>) => {
    if (auth.currentUser) {
        // You could update Firebase profile here if needed, e.g., displayName
        await updateProfile(auth.currentUser, { displayName: data.displayName, photoURL: data.photoURL || auth.currentUser.photoURL });
        
        // Save additional onboarding data to local storage, keyed by UID
        const currentProfileData = localStorage.getItem(`${USER_PROFILE_STORAGE_PREFIX}${auth.currentUser.uid}`);
        const existingData = currentProfileData ? JSON.parse(currentProfileData) : {};
        
        // Exclude properties that shouldn't be stringified if they are complex objects like Date
        const dataToSave = { ...data };
        if (dataToSave.interviewDate instanceof Date) {
            dataToSave.interviewDate = data.interviewDate.toISOString() as any;
        }

        const newData = { ...existingData, ...dataToSave };

        localStorage.setItem(`${USER_PROFILE_STORAGE_PREFIX}${auth.currentUser.uid}`, JSON.stringify(newData));

        // Update the user state in the context, ensuring date is a Date object
        setUser(prevUser => {
          if (!prevUser) return null;
          const updatedUser = { ...prevUser, ...data };
          if(typeof updatedUser.interviewDate === 'string'){
            updatedUser.interviewDate = new Date(updatedUser.interviewDate);
          }
          return updatedUser;
        });
    }
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
