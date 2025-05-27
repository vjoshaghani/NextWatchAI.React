// src/context/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = {
  iso_639_1: string;
  english_name: string;
};

type LanguageMap = Record<string, string>;

const LanguageContext = createContext<LanguageMap>({});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<LanguageMap>({});

  useEffect(() => {
    fetch("/api/tmdb/languages")
      .then((res) => res.json())
      .then((data: Language[]) => {
        const map = data.reduce((acc, lang) => {
          acc[lang.iso_639_1] = lang.english_name;
          return acc;
        }, {} as LanguageMap);
        setLanguages(map);
      })
      .catch(console.error);
  }, []);

  return (
    <LanguageContext.Provider value={languages}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageName = (code: string) => {
  const map = useContext(LanguageContext);
  return map[code] || code;
};
