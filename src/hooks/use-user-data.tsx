// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import { getUserData, updateUserData } from '@/services/firestore';

export interface PomodoroSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export interface PomodoroState {
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  isActive: boolean;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  pomodoroSettings?: PomodoroSettings;
  // Add other user-specific fields here
}

type UserDataContextType = {
  profile: AppUser | null;
  loading: boolean;
  updatePomodoroSettings: (settings: PomodoroSettings) => Promise<void>;
  pomodoroState: PomodoroState;
  setPomodoroState: (state: Partial<PomodoroState>) => void;
  switchPomodoroMode: (mode: PomodoroState['mode']) => void;
  resetPomodoroTimer: () => void;
  togglePomodoroActive: () => void;
};

const UserDataContext = createContext<UserDataContextType>({
  profile: null,
  loading: true,
  updatePomodoroSettings: async () => {},
  pomodoroState: { mode: 'pomodoro', timeLeft: 25 * 60, isActive: false },
  setPomodoroState: () => {},
  switchPomodoroMode: () => {},
  resetPomodoroTimer: () => {},
  togglePomodoroActive: () => {},
});

const DEFAULT_SETTINGS: PomodoroSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
};

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: coreUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pomodoro state managed centrally
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    mode: 'pomodoro',
    timeLeft: (profile?.pomodoroSettings?.pomodoro ?? 25) * 60,
    isActive: false,
  });

  // Effect to fetch user data once we have a user
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!coreUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserData(coreUser);
        setProfile(userData);
        // Initialize Pomodoro timer with user settings
        const settings = userData.pomodoroSettings || DEFAULT_SETTINGS;
        setPomodoroState(prevState => ({
            ...prevState,
            timeLeft: settings[prevState.mode] * 60,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [coreUser, authLoading]);
  
  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoroState.isActive && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prevState => ({ ...prevState, timeLeft: prevState.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoroState.isActive && pomodoroState.timeLeft === 0) {
      // Handle timer completion (e.g., switch mode, notify user)
      setPomodoroState(prevState => ({ ...prevState, isActive: false }));
       // Here you could add a notification or auto-switch to the next mode
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroState.isActive, pomodoroState.timeLeft]);


  const updatePomodoroSettings = useCallback(async (settings: PomodoroSettings) => {
    if (!coreUser) return;
    // Optimistic UI update
    setProfile(prev => prev ? { ...prev, pomodoroSettings: settings } : null);
    
    // Update timer if the current mode's duration changed and it's not active
    if (!pomodoroState.isActive) {
        setPomodoroState(prev => ({...prev, timeLeft: settings[prev.mode] * 60}));
    }

    // Persist to Firestore in the background
    await updateUserData(coreUser.uid, { pomodoroSettings: settings });
  }, [coreUser, pomodoroState.isActive]);


  const internalSetPomodoroState = useCallback((newState: Partial<PomodoroState>) => {
      setPomodoroState(prevState => ({...prevState, ...newState}));
  }, []);

  const switchPomodoroMode = useCallback((newMode: PomodoroState['mode']) => {
      const settings = profile?.pomodoroSettings || DEFAULT_SETTINGS;
      internalSetPomodoroState({
          mode: newMode,
          isActive: false,
          timeLeft: settings[newMode] * 60,
      });
  }, [profile, internalSetPomodoroState]);

  const resetPomodoroTimer = useCallback(() => {
      const settings = profile?.pomodoroSettings || DEFAULT_SETTINGS;
      internalSetPomodoroState({
          isActive: false,
          timeLeft: settings[pomodoroState.mode] * 60,
      });
  }, [profile, pomodoroState.mode, internalSetPomodoroState]);

  const togglePomodoroActive = useCallback(() => {
      internalSetPomodoroState({ isActive: !pomodoroState.isActive });
  }, [pomodoroState.isActive, internalSetPomodoroState]);


  return (
    <UserDataContext.Provider value={{ 
        profile, 
        loading, 
        updatePomodoroSettings,
        pomodoroState,
        setPomodoroState: internalSetPomodoroState,
        switchPomodoroMode,
        resetPomodoroTimer,
        togglePomodoroActive,
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
