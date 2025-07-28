// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import { 
    getUserData, 
    updateUserData,
    updatePortfolioData, 
    type HistoryItem, 
    type Note,
    type Portfolio
} from '@/services/firestore';
import { generateResumeReview } from '@/ai/flows/generate-resume-review-flow';
import { generateCodingQuestion } from '@/ai/flows/generate-coding-question-flow';
import { generateInterviewQuestion } from '@/ai/flows/generate-interview-question-flow';
import { generateNotes } from '@/ai/flows/generate-notes-flow';
import { estimateSalary } from '@/ai/flows/estimate-salary-flow';

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
  portfolio?: Portfolio;
  history?: HistoryItem[];
  notes?: Note[];
}

type UserDataContextType = {
  profile: AppUser | null;
  loading: boolean;
  updatePomodoroSettings: (settings: PomodoroSettings) => Promise<void>;
  updatePortfolio: (portfolio: Portfolio) => Promise<void>;
  pomodoroState: PomodoroState;
  setPomodoroState: (state: Partial<PomodoroState>) => void;
  switchPomodoroMode: (mode: PomodoroState['mode']) => void;
  resetPomodoroTimer: () => void;
  togglePomodoroActive: () => void;
  // AI Actions
  generateResumeReview: typeof generateResumeReview;
  generateCodingQuestion: typeof generateCodingQuestion;
  generateInterviewQuestion: typeof generateInterviewQuestion;
  generateNotes: typeof generateNotes;
  estimateSalary: typeof estimateSalary;
};

const UserDataContext = createContext<UserDataContextType>({
  profile: null,
  loading: true,
  updatePomodoroSettings: async () => {},
  updatePortfolio: async () => {},
  pomodoroState: { mode: 'pomodoro', timeLeft: 25 * 60, isActive: false },
  setPomodoroState: () => {},
  switchPomodoroMode: () => {},
  resetPomodoroTimer: () => {},
  togglePomodoroActive: () => {},
  generateResumeReview: async () => ({ review: '', score: 0 }),
  generateCodingQuestion: async () => ({ question: '', starter_code: '', title: '' }),
  generateInterviewQuestion: async () => ({ question: '' }),
  generateNotes: async () => ({ notes: '' }),
  estimateSalary: async () => ({ median: 0, percentile25: 0, percentile75: 0, rationale: '' }),
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
  
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    mode: 'pomodoro',
    timeLeft: (profile?.pomodoroSettings?.pomodoro ?? 25) * 60,
    isActive: false,
  });

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
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoroState.isActive && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prevState => ({ ...prevState, timeLeft: prevState.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoroState.isActive && pomodoroState.timeLeft === 0) {
      // In a real app, you'd switch modes (e.g., from pomodoro to break)
      setPomodoroState(prevState => ({ ...prevState, isActive: false }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroState.isActive, pomodoroState.timeLeft]);


  const updatePomodoroSettings = useCallback(async (settings: PomodoroSettings) => {
    if (!coreUser) return;
    setProfile(prev => prev ? { ...prev, pomodoroSettings: settings } : null);
    
    if (!pomodoroState.isActive) {
        setPomodoroState(prev => ({...prev, timeLeft: settings[prev.mode] * 60}));
    }

    await updateUserData(coreUser.uid, { pomodoroSettings: settings });
  }, [coreUser, pomodoroState.isActive]);
  
  const updatePortfolio = useCallback(async (portfolioData: Portfolio) => {
    if (!coreUser) return;
    // Optimistic update
    setProfile(prev => prev ? { ...prev, portfolio: portfolioData } : null);
    await updatePortfolioData(coreUser.uid, portfolioData);
  }, [coreUser]);


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
        updatePortfolio,
        pomodoroState,
        setPomodoroState: internalSetPomodoroState,
        switchPomodoroMode,
        resetPomodoroTimer,
        togglePomodoroActive,
        generateResumeReview,
        generateCodingQuestion,
        generateInterviewQuestion,
        generateNotes,
        estimateSalary,
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
