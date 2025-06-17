
'use client';

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (newLang: Language) => void; // Changed to accept newLang directly
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode, initialLanguage: Language }> = ({ children, initialLanguage }) => {
  const [language, setCurrentLanguage] = useState<Language>(initialLanguage);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync context language if initialLanguage from URL param changes (e.g. back/forward navigation)
    if (initialLanguage && initialLanguage !== language) {
      setCurrentLanguage(initialLanguage);
    }
  }, [initialLanguage, language]);

  const setLanguage = (newLang: Language) => {
    if (newLang === language) return;

    // Extract current path without language prefix
    const currentPathParts = pathname.split('/');
    let basePath = '/';
    if (currentPathParts.length > 2 && (currentPathParts[1] === 'en' || currentPathParts[1] === 'tr')) {
      basePath = '/' + currentPathParts.slice(2).join('/');
    } else if (currentPathParts.length > 1 && pathname !== '/') {
      // case where current path is like /login or /animate (no lang prefix yet, or middleware hasn't run)
      // this logic might need refinement if middleware handles all redirects perfectly
      basePath = pathname;
    }
    
    if (basePath === '//') basePath = '/'; // Fix for potential double slash if original path was just /en or /tr

    const newPath = `/${newLang}${basePath === '/' && newLang ? '' : basePath.replace(/\/$/, "") || ''}`;
    
    setCurrentLanguage(newLang); // Update context state immediately
    router.push(newPath); // Navigate to the new URL
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
