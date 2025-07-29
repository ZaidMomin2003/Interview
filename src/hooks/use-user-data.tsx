// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import type { Portfolio, Bookmark, HistoryItem, Note, Reminder, AppUser, NotesInput, Task, TaskStatus, CreateCodingSessionInput, CreateCodingSessionOutput } from '@/ai/schemas';
import { generateResumeReview } from '@/ai/flows/generate-resume-review-flow';
import { generateCodingQuestion } from '@/ai/flows/generate-coding-question-flow';
import { generateInterviewQuestion } from '@/ai/flows/generate-interview-question-flow';
import { generateNotes } from '@/ai/flows/generate-notes-flow';
import { estimateSalary } from '@/ai/flows/estimate-salary-flow';
import { createCodingSession as createCodingSessionFlow } from '@/ai/flows/create-coding-session-flow';
import { generateCodingFeedback as generateCodingFeedbackFlow } from '@/ai/flows/generate-coding-feedback-flow';
import { getUserProfile, createUserProfile, updateUserProfile } from '@/services/firestore';
import type { CodingFeedbackInput } from '@/ai/schemas';


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

export type { HistoryItem, Note, AppUser, Task } from '@/ai/schemas';


// --- Default Data ---
export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
};

export const DEFAULT_PORTFOLIO: Portfolio = {
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
  addNote: (input: NotesInput) => Promise<string | null>;
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  removeReminder: (reminderId: string) => Promise<void>;
  addTask: (title: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
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
  createCodingSession: (input: CreateCodingSessionInput) => Promise<CreateCodingSessionOutput>;
  generateCodingFeedback: (input: CodingFeedbackInput) => Promise<import('/Users/runner/work/studio-2024-07-25-1/studio-2024-07-25-1/src/ai/schemas').CodingFeedbackOutput>;
};

const UserDataContext = createContext<UserDataContextType>({
  profile: null,
  loading: true,
  updatePomodoroSettings: async () => {},
  updatePortfolio: async () => {},
  addHistoryItem: async () => {},
  addBookmark: async () => {},
  removeBookmark: async () => {},
  addNote: async () => null,
  addReminder: async () => {},
  removeReminder: async () => {},
  addTask: async () => {},
  updateTaskStatus: async () => {},
  removeTask: async () => {},
  pomodoroState: { mode: 'pomodoro', timeLeft: 25 * 60, isActive: false },
  setPomodoroState: () => {},
  switchPomodoroMode: () => {},
  resetPomodoroTimer: () => {},
  togglePomodoroActive: () => {},
  generateResumeReview: async () => ({ review: '', score: 0 }),
  generateCodingQuestion: async () => ({ question: '', starter_code: '', title: '' }),
  generateInterviewQuestion: async () => ({ question: '' }),
  generateNotes: async () => ({ title: '', description: '', keyTakeaways: [], contentSections: [] }),
  estimateSalary: async () => ({ median: 0, percentile25: 0, percentile75: 0, rationale: '' }),
  createCodingSession: async () => ({ sessionId: '' }),
  generateCodingFeedback: async () => ({ analysis: '', suggestedSolution: '' }),
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

  // Load data from Firestore on user change
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

    const fetchProfile = async () => {
        setLoading(true);
        let userProfile = await getUserProfile(coreUser.uid);

        if (!userProfile) {
            // User exists in Auth, but not in Firestore. Create a new profile.
            const newProfile: AppUser = {
                uid: coreUser.uid,
                email: coreUser.email,
                displayName: coreUser.displayName,
                photoURL: coreUser.photoURL,
                pomodoroSettings: DEFAULT_POMODORO_SETTINGS,
                portfolio: {
                    ...DEFAULT_PORTFOLIO,
                    displayName: coreUser.displayName || 'New User',
                },
                history: [],
                notes: [],
                bookmarks: [],
                reminders: [],
                tasks: [],
            };
            await createUserProfile(newProfile);
            userProfile = newProfile;
        }

        setProfile(userProfile);
        
        // Initialize Pomodoro timer with loaded settings
        const settings = userProfile.pomodoroSettings || DEFAULT_POMODORO_SETTINGS;
        setPomodoroState(prevState => ({
            ...prevState,
            timeLeft: settings[prevState.mode] * 60,
        }));
        
        setLoading(false);
    };

    fetchProfile();
  }, [coreUser, authLoading]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoroState.isActive && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prevState => ({ ...prevState, timeLeft: prevState.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoroState.isActive && pomodoroState.timeLeft === 0) {
      setPomodoroState(prevState => ({ ...prevState, isActive: false }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroState.isActive, pomodoroState.timeLeft]);

  // --- Data Update Functions ---
  const updateProfileData = useCallback(async (newProfileData: Partial<AppUser>) => {
    if (!profile) return;
    const updatedProfile = { ...profile, ...newProfileData };
    setProfile(updatedProfile); // Optimistic update
    await updateUserProfile(profile.uid, newProfileData);
  }, [profile]);

  const updatePomodoroSettings = useCallback(async (settings: PomodoroSettings) => {
    await updateProfileData({ pomodoroSettings: settings });
    if (!pomodoroState.isActive) {
        setPomodoroState(prev => ({...prev, timeLeft: settings[prev.mode] * 60}));
    }
  }, [updateProfileData, pomodoroState.isActive]);
  
  const updatePortfolio = useCallback(async (portfolioData: Portfolio) => {
    await updateProfileData({ portfolio: portfolioData });
  }, [updateProfileData]);

  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!profile) return;
    const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...profile.history];
    await updateProfileData({ history: updatedHistory });
  }, [profile, updateProfileData]);

  const addBookmark = useCallback(async (item: Omit<Bookmark, 'id' | 'timestamp'>) => {
    if (!profile) return;
    const newBookmark: Bookmark = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };
    const updatedBookmarks = [newBookmark, ...profile.bookmarks];
    await updateProfileData({ bookmarks: updatedBookmarks });
  }, [profile, updateProfileData]);

  const removeBookmark = useCallback(async (bookmarkId: string) => {
    if (!profile) return;
    const updatedBookmarks = profile.bookmarks.filter(b => b.id !== bookmarkId);
    await updateProfileData({ bookmarks: updatedBookmarks });
  }, [profile, updateProfileData]);

  const addNote = useCallback(async (input: NotesInput): Promise<string | null> => {
    if (!profile) return null;
    
    // 1. Generate the note content from the AI
    const content = await generateNotes(input);

    // 2. Create the new note object
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: content.title,
      content: content,
      timestamp: Date.now(),
    };
    
    // 3. Add to the user's notes array
    const updatedNotes = [newNote, ...(profile.notes || [])];
    
    // 4. Add a corresponding history item
    const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        type: 'notes',
        title: `Notes on: ${input.topic}`,
        content: `Generated a new note: "${content.title}".`, // Simple summary for history view
        timestamp: Date.now(),
    };
    const updatedHistory = [newHistoryItem, ...profile.history];

    // 5. Update the profile in Firestore
    await updateProfileData({ notes: updatedNotes, history: updatedHistory });

    // 6. Return the ID of the new note for redirection
    return newNote.id;
  }, [profile, updateProfileData]);


  const addReminder = useCallback(async (item: Omit<Reminder, 'id'>) => {
    if (!profile) return;
    const newReminder: Reminder = {
      ...item,
      id: crypto.randomUUID(),
    };
    const updatedReminders = [...(profile.reminders || []), newReminder].sort((a,b) => a.date - b.date);
    await updateProfileData({ reminders: updatedReminders });
  }, [profile, updateProfileData]);

  const removeReminder = useCallback(async (reminderId: string) => {
    if (!profile) return;
    const updatedReminders = (profile.reminders || []).filter(r => r.id !== reminderId);
    await updateProfileData({ reminders: updatedReminders });
  }, [profile, updateProfileData]);

  const addTask = useCallback(async (title: string) => {
    if (!profile) return;
    const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        status: 'todo',
    };
    const updatedTasks = [...(profile.tasks || []), newTask];
    await updateProfileData({ tasks: updatedTasks });
  }, [profile, updateProfileData]);

  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    if (!profile) return;
    const updatedTasks = (profile.tasks || []).map(task => 
        task.id === taskId ? { ...task, status } : task
    );
    await updateProfileData({ tasks: updatedTasks });
  }, [profile, updateProfileData]);

  const removeTask = useCallback(async (taskId: string) => {
    if (!profile) return;
    const updatedTasks = (profile.tasks || []).filter(task => task.id !== taskId);
    await updateProfileData({ tasks: updatedTasks });
  }, [profile, updateProfileData]);


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
          timeLeft: pomodoroState.mode ? settings[pomodoroState.mode] * 60 : DEFAULT_POMODORO_SETTINGS.pomodoro * 60,
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
        addNote,
        addReminder,
        removeReminder,
        addTask,
        updateTaskStatus,
        removeTask,
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
        createCodingSession: createCodingSessionFlow,
        generateCodingFeedback: generateCodingFeedbackFlow,
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
