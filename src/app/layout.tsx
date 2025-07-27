// src/app/layout.tsx
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Outfit, Syne } from 'next/font/google'
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/hooks/use-theme';
import { useSessionHandler } from '@/hooks/use-session-handler';
import { UserDataProvider } from '@/hooks/use-user-data';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})

// This is a client component because it contains the main providers
// and the session handler hook.
function ClientRootLayout({ children }: { children: React.ReactNode }) {
  // This hook manages setting/clearing the session cookie
  useSessionHandler();

  return (
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          <UserDataProvider>
            {children}
            <Toaster />
          </UserDataProvider>
      </ThemeProvider>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${syne.variable} font-body antialiased`}>
        <AuthProvider>
          <ClientRootLayout>
            {children}
          </ClientRootLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
