import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, LANGUAGES } from "./i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem("lang");
    return LANGUAGES.some((l) => l.code === stored) ? stored : "nl";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = translations[lang] ?? translations.nl;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
