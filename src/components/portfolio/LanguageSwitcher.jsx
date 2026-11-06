import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";

function FlagNL({ className }) {
  return (
    <svg viewBox="0 0 9 6" className={className} aria-hidden="true">
      <rect width="9" height="2" y="0" fill="#AE1C28" />
      <rect width="9" height="2" y="2" fill="#FFFFFF" />
      <rect width="9" height="2" y="4" fill="#21468B" />
    </svg>
  );
}

function FlagGB({ className }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <clipPath id="gb-t">
        <path d="M30,15 h30v15zv15h-30zh-30v-15zv-15h30z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#gb-t)" stroke="#cf142b" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}

const FLAGS = { nl: FlagNL, en: FlagGB };

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const other = LANGUAGES.find((l) => l.code !== lang) ?? LANGUAGES[1];
  const CurrentFlag = FLAGS[current.code];

  return (
    <button
      onClick={() => setLang(other.code)}
      aria-label={`Switch language to ${other.name}`}
      className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-border text-sm text-muted-foreground dark:text-white hover:bg-primary dark:hover:bg-[#15609e] hover:text-white hover:border-primary transition-all duration-200">
      <CurrentFlag className="w-4 h-auto rounded-[2px] overflow-hidden flex-shrink-0" />
      <span className="font-mono font-medium">{current.label}</span>
    </button>
  );
}
