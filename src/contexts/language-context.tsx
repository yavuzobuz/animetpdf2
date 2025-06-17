
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (newLang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define supported languages here for use within the context
const SUPPORTED_LANGUAGES: Language[] = ['en', 'tr'];

export const LanguageProvider: React.FC<{ children: ReactNode, initialLanguage: Language }> = ({ children, initialLanguage }) => {
  const [language, setCurrentLanguage] = useState<Language>(initialLanguage);
  const router = useRouter();
  const pathname = usePathname(); // e.g., /tr/about, /en, /

  useEffect(() => {
    // Sync context language if initialLanguage from URL param changes (e.g. back/forward navigation)
    if (initialLanguage && initialLanguage !== language) {
      setCurrentLanguage(initialLanguage);
    }
  }, [initialLanguage, language]);

  const setLanguage = (newLang: Language) => {
    if (newLang === language) return;

    const currentPathSegments = pathname.split('/').filter(Boolean); //  e.g. ['tr', 'about'] or ['en'] or [] for root
    let purePath = '/'; // Default to root path

    if (currentPathSegments.length > 0) {
      if (SUPPORTED_LANGUAGES.includes(currentPathSegments[0] as Language)) {
        // If the first segment is a language code, take the rest as the pure path
        // e.g., from ['tr', 'about'], purePath becomes '/about'
        // e.g., from ['en'], purePath becomes '/'
        purePath = '/' + currentPathSegments.slice(1).join('/');
      } else {
        // If the first segment is not a language code, the whole path is the pure path
        // This case should ideally be handled by middleware ensuring lang prefix
        // e.g. from ['about'], purePath becomes '/about'
        purePath = pathname;
      }
    }
    
    // Ensure purePath doesn't become '//' if original was just '/tr' or '/en' which results in purePath = '/' + [] = '/'
    // So, if purePath from slice(1).join('/') results in an empty string (meaning original path was just /<lang>),
    // it should remain '/'
    if (purePath === '//') { // This can happen if currentPathSegments.slice(1).join('/') is empty
      purePath = '/';
    }
    
    // Construct the new path: /<newLang><purePath>
    // If purePath is '/', newPath should be /<newLang> (e.g., /en, /tr)
    // Otherwise, it's /<newLang>/actual/path
    const newPath = `/${newLang}${purePath === '/' ? '' : purePath}`;
    
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
