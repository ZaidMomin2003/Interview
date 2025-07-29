// src/app/client-providers.tsx
"use client";

import { ThemeProvider } from 'next-themes';
import { UserDataProvider } from '@/hooks/use-user-data';
import { useSessionHandler } from '@/hooks/use-session-handler';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // This hook manages setting/clearing the session cookie
  useSessionHandler();

  return (
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
      >
          <UserDataProvider>
            {children}
          </UserDataProvider>
      </ThemeProvider>
  );
}
