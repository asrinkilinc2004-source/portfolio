import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIN = "190304";
const SESSION_KEY = "portfolio_unlocked";

const COPY = {
  nl: {
    enterPin: "Voer de pincode in",
    requestCode: "Een toegangscode aanvragen?",
    linkedin: "Stuur mij een persoonlijk bericht via LinkedIn.",
    deleteDigit: "Verwijder laatste cijfer",
    digit: "Cijfer",
  },
  en: {
    enterPin: "Enter the PIN",
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
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
      >
        <div className="absolute top-5 right-5 flex rounded-lg border border-[#00A1DE]/45 bg-[#061827]/90 p-1 shadow-lg shadow-black/30">
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
                  ? "bg-[#00A1DE] text-white"
                  : "text-white/65 hover:bg-[#00A1DE]/15 hover:text-[#00A1DE]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-7 sm:gap-10 px-6 sm:px-8">
          {/* Logo / name */}
          <div className="text-center">
            <p className="font-mono text-xs text-[#00A1DE] tracking-[0.3em] uppercase mb-2">Portfolio</p>
            <h1 className="text-2xl font-bold tracking-tight text-white">Asrin Kilinc</h1>
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
                  ? "border-[#00A1DE] bg-[#00A1DE]"
                  : "border-white/30 bg-transparent"
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
                      ? "border-white/20 text-white/60 hover:text-white hover:border-[#00A1DE]/70 hover:bg-[#00A1DE]/15 text-sm"
                      : "border-white/20 text-white hover:border-[#00A1DE] hover:bg-[#00A1DE]"
                  } bg-white/[0.04]`}
                >
                  {k === "del" ? "⌫" : k}
                </button>
              );
            })}
          </div>

          <div className="max-w-xs text-center space-y-2">
            <p className="text-xs text-white/65 font-mono">{copy.enterPin}</p>
            <p className="text-xs text-white/65 leading-relaxed">
              {copy.requestCode}{" "}
              <a
                href="https://www.linkedin.com/in/asrin-k/"
                target="_blank"
                rel="noreferrer"
                className="text-[#00A1DE] font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
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
