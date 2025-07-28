// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import type { Portfolio, Bookmark, HistoryItem, Note } from '@/ai/schemas';
import { generateResumeReview } from '@/ai/flows/generate-resume-review-flow';
import { generateCodingQuestion } from '@/ai/flows/generate-coding-question-flow';
import { generateInterviewQuestion } from '@/ai/flows/generate-interview-question-flow';
import { generateNotes } from '@/ai/flows/generate-notes-flow';
import { estimateSalary } from '@/ai/flows/estimate-salary-flow';

// --- Interfaces ---
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

export type { HistoryItem, Note, AppUser } from '@/ai/schemas';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  pomodoroSettings: PomodoroSettings;
  portfolio: Portfolio;
  history: HistoryItem[];
  notes: Note[];
  bookmarks: Bookmark[];
}


// --- Local Storage Helpers ---
const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const setInLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
    }
};


// --- Default Data ---
const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
};

const DEFAULT_PORTFOLIO: Portfolio = {
    isPublic: true,
    displayName: 'Zaid Momin',
    bio: 'Senior AI Engineer specializing in Next.js and Large Language Models.',
    location: 'Bijapur, India',
    skills: [
        { name: 'React' },
        { name: 'Next.js' },
        { name: 'TypeScript' },
        { name: 'Node.js' },
        { name: 'Genkit AI' },
        { name: 'Firebase' },
        { name: 'Tailwind CSS' },
        { name: 'Python' },
    ],
    projects: [
        {
            title: 'AI-Powered Career Co-Pilot',
            description: 'A comprehensive platform (this app!) designed to help developers with resume optimization, mock interviews, and coding practice using generative AI.',
            url: 'https://github.com/ZaidMomin2003/talxify',
        },
        {
            title: 'E-commerce Analytics Dashboard',
            description: 'A real-time analytics dashboard for an e-commerce platform, built with React, to track sales, user behavior, and inventory.',
            url: '',
        }
    ],
    certifications: [
      {
        name: 'Google Certified Professional Cloud Architect',
        issuer: 'Google Cloud',
        url: 'https://www.credential.net/'
      },
      {
        name: 'Certified Kubernetes Application Developer (CKAD)',
        issuer: 'The Linux Foundation',
        url: 'https://www.credential.net/'
      }
    ],
    achievements: [
        {
            description: 'Won 1st place in the 2024 National Hackathon for "Best Use of AI".',
            date: 'May 2024'
        },
        {
            description: 'Published a technical article on "Advanced State Management in React" that received 50k+ views.',
            date: 'February 2024'
        }
    ],
    socials: { 
        github: 'https://github.com/ZaidMomin2003', 
        linkedin: 'https://www.linkedin.com/in/arshad-momin-a3139b21b/', 
        twitter: 'https://x.com/zaidwontdo', 
        website: 'https://zaidmomin.vercel.app' 
    }
};


// --- Context Definition ---
type UserDataContextType = {
  profile: AppUser | null;
  loading: boolean;
  updatePomodoroSettings: (settings: PomodoroSettings) => Promise<void>;
  updatePortfolio: (portfolio: Portfolio) => Promise<void>;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => Promise<void>;
  removeBookmark: (bookmarkId: string) => Promise<void>;
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
  addHistoryItem: async () => {},
  addBookmark: async () => {},
  removeBookmark: async () => {},
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


// --- Provider Component ---
export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: coreUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    mode: 'pomodoro',
    timeLeft: DEFAULT_POMODORO_SETTINGS.pomodoro * 60,
    isActive: false,
  });

  // Load data from local storage on user change
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

    setLoading(true);
    const userProfileKey = `talxify_profile_${coreUser.uid}`;
    const storedProfile = getFromLocalStorage<Partial<AppUser>>(userProfileKey, {});

    const initialProfile: AppUser = {
        uid: coreUser.uid,
        email: coreUser.email,
        displayName: coreUser.displayName || storedProfile.portfolio?.displayName || 'Zaid Momin',
        photoURL: coreUser.photoURL,
        pomodoroSettings: storedProfile.pomodoroSettings || DEFAULT_POMODORO_SETTINGS,
        portfolio: storedProfile.portfolio || DEFAULT_PORTFOLIO,
        history: storedProfile.history || [],
        notes: storedProfile.notes || [],
        bookmarks: storedProfile.bookmarks || [],
    };
    
    // If it's a new user, let's give them some default data to play with.
    if (!storedProfile.history) {
        initialProfile.history = [
            { id: '1', type: 'coding', title: 'Coding: Two Sum', timestamp: Date.now() - 86400000 * 2, content: { title: 'Two Sum', question: '...' } },
            { id: '2', type: 'interview', title: 'Interview Question for Frontend Engineer', timestamp: Date.now() - 86400000, content: { question: '...' } },
        ];
    }
    if (!storedProfile.portfolio) {
        initialProfile.portfolio.displayName = coreUser.displayName || 'Zaid Momin';
    }


    setProfile(initialProfile);
    setInLocalStorage(userProfileKey, initialProfile);
    
    // Initialize Pomodoro timer with loaded settings
    const settings = initialProfile.pomodoroSettings;
    setPomodoroState(prevState => ({
        ...prevState,
        timeLeft: settings[prevState.mode] * 60,
    }));
    
    setLoading(false);
  }, [coreUser, authLoading]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoroState.isActive && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prevState => ({ ...prevState, timeLeft: prevState.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoroState.isActive && pomodoroState.timeLeft === 0) {
      // Logic for when timer finishes (e.g., notification, switch mode) can be added here
      setPomodoroState(prevState => ({ ...prevState, isActive: false }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroState.isActive, pomodoroState.timeLeft]);

  // --- Data Update Functions ---
  const updateProfileAndPersist = useCallback((newProfileData: Partial<AppUser>) => {
    if (!coreUser) return;

    setProfile(prevProfile => {
        if (!prevProfile) return null;
        const updatedProfile = { ...prevProfile, ...newProfileData };
        const userProfileKey = `talxify_profile_${coreUser.uid}`;
        setInLocalStorage(userProfileKey, updatedProfile);
        return updatedProfile;
    });
  }, [coreUser]);

  const updatePomodoroSettings = useCallback(async (settings: PomodoroSettings) => {
    updateProfileAndPersist({ pomodoroSettings: settings });
    if (!pomodoroState.isActive) {
        setPomodoroState(prev => ({...prev, timeLeft: settings[prev.mode] * 60}));
    }
  }, [updateProfileAndPersist, pomodoroState.isActive]);
  
  const updatePortfolio = useCallback(async (portfolioData: Portfolio) => {
    updateProfileAndPersist({ portfolio: portfolioData });
  }, [updateProfileAndPersist]);

  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!profile) return;
    const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...profile.history];
    updateProfileAndPersist({ history: updatedHistory });
  }, [profile, updateProfileAndPersist]);

  const addBookmark = useCallback(async (item: Omit<Bookmark, 'id' | 'timestamp'>) => {
    if (!profile) return;
    const newBookmark: Bookmark = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };
    const updatedBookmarks = [newBookmark, ...profile.bookmarks];
    updateProfileAndPersist({ bookmarks: updatedBookmarks });
  }, [profile, updateProfileAndPersist]);

  const removeBookmark = useCallback(async (bookmarkId: string) => {
    if (!profile) return;
    const updatedBookmarks = profile.bookmarks.filter(b => b.id !== bookmarkId);
    updateProfileAndPersist({ bookmarks: updatedBookmarks });
  }, [profile, updateProfileAndPersist]);


  // --- Pomodoro Control Functions ---
  const internalSetPomodoroState = useCallback((newState: Partial<PomodoroState>) => {
      setPomodoroState(prevState => ({...prevState, ...newState}));
  }, []);

  const switchPomodoroMode = useCallback((newMode: PomodoroState['mode']) => {
      const settings = profile?.pomodoroSettings || DEFAULT_POMODORO_SETTINGS;
      internalSetPomodoroState({
          mode: newMode,
          isActive: false,
          timeLeft: settings[newMode] * 60,
      });
  }, [profile, internalSetPomodoroState]);

  const resetPomodoroTimer = useCallback(() => {
      const settings = profile?.pomodoroSettings || DEFAULT_POMODORO_SETTINGS;
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
        addHistoryItem,
        addBookmark,
        removeBookmark,
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
