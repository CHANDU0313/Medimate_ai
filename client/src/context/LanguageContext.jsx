import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/storage';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang) => {},
  t: translations.en,
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = getStoredLanguage();
    return saved === 'te' ? 'te' : 'en';
  });

  const setLanguage = (lang) => {
    const valid = lang === 'te' ? 'te' : 'en';
    setLanguageState(valid);
    setStoredLanguage(valid);
    document.documentElement.lang = valid === 'te' ? 'te' : 'en';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language === 'te' ? 'te' : 'en';
  }, [language]);

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
