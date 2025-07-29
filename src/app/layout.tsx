// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Outfit, Syne } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import { ClientProviders } from './client-providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: 'Talxify',
  description: 'Your AI-powered career co-pilot for developers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${syne.variable} font-body antialiased`}>
        <AuthProvider>
          <ClientProviders>
            {children}
            <Toaster />
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
