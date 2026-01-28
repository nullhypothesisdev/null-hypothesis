'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language metadata
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' as const },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' as const },
} as const;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initLanguage() {
      // 1. Recover Language Preference
      const savedLang = localStorage.getItem('language') as Language;
      const targetLang = (savedLang && ['en', 'ar'].includes(savedLang)) ? savedLang : 'en';

      if (targetLang !== language) {
        setLanguageState(targetLang);
      }

      // 2. Try to load cached translations immediately
      const cached = localStorage.getItem(`translations_${targetLang}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setTranslations(parsed);
          setIsLoading(false); // We have content, so we are "loaded" enough for UI
        } catch (e) {
          console.error("Invalid cached translations");
        }
      }

      // 3. Fetch fresh translations from Supabase
      // Even if cached, we refresh in background
      try {
        const { data, error } = await supabase
          .from('ui_translations')
          .select('namespace, translations');

        if (error) throw error;

        if (data) {
          const flattenedTranslations: Record<string, string> = {};

          data.forEach((row: { namespace: string; translations: any }) => {
            const ns = row.namespace;
            // Extract appropriate locale from nested structure
            const trans = row.translations[targetLang] || row.translations['en'];

            const flattenKeys = (obj: any, prefix: string) => {
              Object.entries(obj).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                  flattenKeys(value, newKey);
                } else {
                  flattenedTranslations[newKey] = String(value);
                }
              });
            };

            if (trans && typeof trans === 'object') {
              flattenKeys(trans, ns);
            }
          });

          // Check if updates are actual updates to avoid unnecessary re-renders
          if (JSON.stringify(flattenedTranslations) !== cached) {
            setTranslations(flattenedTranslations);
            localStorage.setItem(`translations_${targetLang}`, JSON.stringify(flattenedTranslations));
          }
        }
      } catch (err) {
        console.error('Failed to load translations:', err);
        // If we didn't have cache, we are in trouble. 
        // If we had cache, user is fine with slightly stale data.
      } finally {
        setIsLoading(false);
      }

      // 4. Update Document attributes
      if (typeof document !== 'undefined') {
        const pathname = window.location.pathname;
        const specialRoutes = ['/showcase', '/gift'];
        if (!specialRoutes.some(route => pathname.startsWith(route))) {
          document.documentElement.dir = LANGUAGES[targetLang].dir;
          document.documentElement.lang = targetLang;
        } else {
          document.documentElement.dir = 'ltr';
        }
      }
    }

    initLanguage();
  }, [language]); // Depend on language so setLanguage() triggers this too

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        t,
        isLoading,
        dir: LANGUAGES[language].dir
      }}
    >
      <div dir={LANGUAGES[language].dir} className="contents">
        <AnimatePresence mode="wait">
          <motion.div
            key={language}
            initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}