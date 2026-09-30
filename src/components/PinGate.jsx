import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIN = "190304";
const SESSION_KEY = "portfolio_unlocked";

const COPY = {
  nl: {
    enterPin: "Voer je pincode in",
    requestCode: "Een toegangscode aanvragen?",
    linkedin: "Stuur mij een persoonlijk bericht via LinkedIn.",
    deleteDigit: "Verwijder laatste cijfer",
    digit: "Cijfer",
  },
  en: {
    enterPin: "Enter your PIN",
    requestCode: "Need an access code?",
    linkedin: "Send me a personal message on LinkedIn.",
    deleteDigit: "Delete last digit",
    digit: "Digit",
  },
};

export default function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") === "en" ? "en" : "nl"
  );
  const [digits, setDigits] = useState([]);
  const [shake, setShake] = useState(false);
  const copy = COPY[language];

  useEffect(() => {
    localStorage.setItem("lang", language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", "ltr");
  }, [language]);

  useEffect(() => {
    if (unlocked) return;
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9" && digits.length < PIN.length) {
        setDigits((d) => [...d, e.key]);
      }
      if (e.key === "Backspace") {
        setDigits((d) => d.slice(0, -1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlocked, digits]);

  useEffect(() => {
    if (digits.length !== PIN.length) return;
    if (digits.join("") === PIN) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setTimeout(() => setUnlocked(true), 200);
    } else {
      setShake(true);
      setTimeout(() => { setShake(false); setDigits([]); }, 600);
    }
  }, [digits]);

  const handlePad = (val) => {
    if (val === "del") { setDigits((d) => d.slice(0, -1)); return; }
    setDigits((d) => d.length < PIN.length ? [...d, val] : d);
  };

  if (unlocked) return children;

  const padKeys = ["1","2","3","4","5","6","7","8","9","","0","del"];

  return (
    <AnimatePresence>
      <motion.div
        key="pin-gate"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        <div className="absolute top-5 right-5 flex rounded-lg border border-primary/25 bg-card p-1 shadow-sm">
          {[
            ["nl", "NL"],
            ["en", "EN"],
          ].map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              aria-pressed={language === code}
              className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
                language === code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-7 sm:gap-10 px-6 sm:px-8">
          {/* Logo / name */}
          <div className="text-center">
            <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-2">Portfolio</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Asrin Kilinc</h1>
          </div>

          {/* Dots */}
          <motion.div
            animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex gap-3 sm:gap-4"
          >
            {Array.from({ length: PIN.length }, (_, i) => i).map((i) => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                digits.length > i
                  ? "border-primary bg-primary"
                  : "border-border bg-transparent"
              }`} />
            ))}
          </motion.div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3">
            {padKeys.map((k, i) => {
              if (k === "") return <div key={i} />;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePad(k)}
                  aria-label={k === "del" ? copy.deleteDigit : `${copy.digit} ${k}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border text-lg font-medium transition-all duration-100 active:scale-95 ${
                    k === "del"
                      ? "border-border text-muted-foreground hover:text-foreground hover:border-primary/40 text-sm"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                  } bg-card`}
                >
                  {k === "del" ? "⌫" : k}
                </button>
              );
            })}
          </div>

          <div className="max-w-xs text-center space-y-2">
            <p className="text-xs text-muted-foreground/60 font-mono">{copy.enterPin}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {copy.requestCode}{" "}
              <a
                href="https://www.linkedin.com/in/asrin-k/"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
              >
                {copy.linkedin}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
