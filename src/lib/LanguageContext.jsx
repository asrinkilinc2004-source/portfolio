import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, LANGUAGES } from "./i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "nl");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    const isRtl = LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
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
