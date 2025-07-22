import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Outfit, Syne } from 'next/font/google'
import { AuthProvider } from '@/hooks/use-auth';


const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})


export const metadata: Metadata = {
  title: 'Talxify',
  description: 'AI-powered career development platform for developers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${syne.variable} font-body antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
