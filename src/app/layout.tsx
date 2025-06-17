
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/custom/navbar';
import { LanguageProvider } from '@/contexts/language-context'; // LanguageProvider import edildi

export const metadata: Metadata = {
  title: 'AnimatePDF',
  description: 'Upload a PDF, get an animation scenario, and preview it!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Default lang attribute for the page */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <LanguageProvider> {/* LanguageProvider ile sarmalandı */}
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
