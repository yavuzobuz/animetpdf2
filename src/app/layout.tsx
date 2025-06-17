
import type { Metadata } from 'next';
import './globals.css';
// LanguageProvider and Navbar are removed from here as they will be in [lang]/layout.tsx
// Toaster can remain here or be moved, but for simplicity, let's assume it's also in [lang]/layout.tsx

export const metadata: Metadata = {
  title: 'AnimatePDF',
  description: 'Upload a PDF, get an animation scenario, and preview it!',
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
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        {children}
      </body>
    </html>
  );
}
