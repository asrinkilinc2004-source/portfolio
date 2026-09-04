import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIN = "1313";
const SESSION_KEY = "portfolio_unlocked";

export default function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [digits, setDigits] = useState([]);
  const [shake, setShake] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (unlocked) return;
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9" && digits.length < 4) {
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
    if (digits.length !== 4) return;
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
    if (digits.length < 4) setDigits((d) => [...d, val]);
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

        <div className="relative flex flex-col items-center gap-10 px-8">
          {/* Logo / name */}
          <div className="text-center">
            <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-2">Portfolio</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Asrin Kilinc</h1>
          </div>

          {/* Dots */}
          <motion.div
            animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            {[0,1,2,3].map((i) => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                digits.length > i
                  ? "border-primary bg-primary"
                  : "border-border bg-transparent"
              }`} />
            ))}
          </motion.div>

          {/* Numpad */}
          <div ref={containerRef} className="grid grid-cols-3 gap-3">
            {padKeys.map((k, i) => {
              if (k === "") return <div key={i} />;
              return (
                <button
                  key={i}
                  onClick={() => handlePad(k)}
                  className={`w-16 h-16 rounded-2xl border text-lg font-medium transition-all duration-100 active:scale-95 ${
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

          <p className="text-xs text-muted-foreground/50 font-mono">voer pincode in</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
