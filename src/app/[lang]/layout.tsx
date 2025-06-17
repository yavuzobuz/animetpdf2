
import type { Metadata } from 'next';
import '../globals.css'; // Ensure globals.css is imported from the correct relative path
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/custom/navbar';
import { LanguageProvider } from '@/contexts/language-context';
import { type ReactNode } from 'react';

// No global metadata here, it can be in the root layout or dynamically generated
// export const metadata: Metadata = { ... };

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }];
}

export default function LangLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: string };
}>) {
  return (
    // The html and body tags are in the root src/app/layout.tsx
    // This component effectively replaces the content of the root body
    // We set the lang attribute on the <html> tag in the root layout.
    // However, for client components to easily access lang, we pass it to LanguageProvider.
    <LanguageProvider initialLanguage={params.lang as 'en' | 'tr'}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Toaster />
    </LanguageProvider>
  );
}

// We need to update the RootLayout in src/app/layout.tsx to set the lang attribute on <html>
// This will be done by having the root layout just pass children.
// The actual <html> and <body> tags need to be in src/app/layout.tsx
// This file (src/app/[lang]/layout.tsx) provides the content *within* the <body> tag.

// Corrected thinking: The src/app/layout.tsx will have <html> and <body>.
// src/app/[lang]/layout.tsx will define the content *for a specific language*.
// So, the <html> tag in src/app/layout.tsx should have its lang attribute
// set dynamically if possible, or this LangLayout would need to be structured
// differently. Next.js convention is that the root layout has <html>.
// Let's assume the root layout's <html> tag will handle `lang` if needed,
// or we rely on client-side hydration and context for language.
// For now, the LanguageProvider is key.

// Re-simplifying: The root layout (src/app/layout.tsx) will just have <html><body> and pass children.
// This [lang]/layout.tsx then becomes the primary layout structure *inside* body.
// The metadata needs to be handled carefully, likely in the root and then overridden.
// The html tag's lang attribute is set in the root layout now (manually, needs to be dynamic or this LangLayout provides it)
// Let's make the root layout's HTML tag dynamic in a follow-up if needed, or just rely on the LanguageProvider
// For now, RootLayout in src/app/layout.tsx is simplified.
// This [lang]/layout.tsx provides the main structure.
