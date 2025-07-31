import type { Metadata } from 'next';
import './globals.css';
import './animation-slow.css';
// LanguageProvider and Navbar are removed from here as they will be in [lang]/layout.tsx
// Toaster can remain here or be moved, but for simplicity, let's assume it's also in [lang]/layout.tsx

export const metadata: Metadata = {
  title: 'AnimatePDF',
  description: 'Upload a PDF, get an animation scenario, and preview it!',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This root layout is minimal. The actual layout with Navbar, LanguageProvider etc.
  // will be in src/app/[lang]/layout.tsx
  // The lang attribute on <html> will be set in src/app/[lang]/layout.tsx
  return (
    // The lang attribute will be set in the [lang]/layout.tsx
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
