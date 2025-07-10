import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import { Navbar } from '@/components/custom/navbar';
import { Toaster } from '@/components/ui/toaster';

export default async function AdminSectionLayout({ children, params }: Readonly<{ children: ReactNode; params: { lang: string } }>) {
  // Properly handle params to avoid the "params should be awaited" error
  const lang = params.lang;
  return (
    <LanguageProvider initialLanguage={lang as 'en' | 'tr'}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          {/* Footer intentionally omitted in admin section */}
        </div>
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}
