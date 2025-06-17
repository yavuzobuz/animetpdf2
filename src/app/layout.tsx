
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/custom/navbar'; // Navbar import edildi

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <Navbar /> {/* Navbar buraya eklendi */}
        <main className="flex-grow"> {/* Ana içerik alanı için main etiketi eklendi */}
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
