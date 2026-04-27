import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 h-9 px-3 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
        <span className="font-mono font-medium">{current?.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-40 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                lang === l.code
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
              <span>{l.name}</span>
              <span className="font-mono text-xs opacity-60">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
