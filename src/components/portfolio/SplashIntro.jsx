import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";
const rnd  = () => POOL[Math.floor(Math.random() * POOL.length)];

const FIRST = "ASRIN";
const LAST  = "KILINC";
const TOTAL = FIRST.length + LAST.length; // 11

export default function SplashIntro({ onDone }) {
  const [show,    setShow]    = useState(false);
  const [wipeOut, setWipeOut] = useState(false);
  const [locked,  setLocked]  = useState(0);          // 0-11
  const [chars,   setChars]   = useState(() => ({
    first: FIRST.split("").map(rnd),
    last:  LAST.split("").map(rnd),
  }));

  useEffect(() => {
    if (sessionStorage.getItem("splash")) { onDone?.(); return; }
    sessionStorage.setItem("splash", "1");
    setShow(true);

    let lockedCount = 0;
    let lockId, scrambleId;

    const boot = setTimeout(() => {
      // Scramble unlocked chars every 40ms
      scrambleId = setInterval(() => {
        setChars({
          first: FIRST.split("").map((c, i) => i < Math.min(lockedCount, FIRST.length) ? c : rnd()),
          last:  LAST.split("").map((c, i) => {
            const g = i + FIRST.length;
            return g < lockedCount ? c : rnd();
          }),
        });
      }, 40);

      // Lock one char every 75ms
      lockId = setInterval(() => {
        lockedCount++;
        setLocked(lockedCount);
        if (lockedCount >= TOTAL) {
          clearInterval(lockId);
          clearInterval(scrambleId);
          setTimeout(() => setWipeOut(true), 550);
          setTimeout(() => { setShow(false); onDone?.(); }, 1320);
        }
      }, 75);
    }, 350);

    return () => {
      clearTimeout(boot);
      clearInterval(lockId);
      clearInterval(scrambleId);
    };
  }, []);

  const allLocked = locked >= TOTAL;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center gap-6 overflow-hidden"
          animate={wipeOut ? { y: "-102%" } : { y: 0 }}
          transition={wipeOut ? { duration: 0.72, ease: [0.76, 0, 0.24, 1] } : {}}
        >
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Name */}
          <div className="relative flex flex-col items-center select-none">
            {/* First name */}
            <div className="flex" style={{ fontSize: "clamp(3.5rem,13vw,8.5rem)", lineHeight: 1 }}>
              {chars.first.map((ch, i) => {
                const isLocked = i < locked;
                return (
                  <motion.span
                    key={i}
                    className="font-bold"
                    style={{ display: "inline-block", letterSpacing: "-0.02em" }}
                    animate={isLocked ? { color: "hsl(var(--foreground))" } : { color: "hsl(var(--primary)/0.4)" }}
                    transition={{ duration: 0.05 }}
                  >
                    {isLocked ? FIRST[i] : ch}
                  </motion.span>
                );
              })}
            </div>

            {/* Last name */}
            <div className="flex" style={{ fontSize: "clamp(3.5rem,13vw,8.5rem)", lineHeight: 1 }}>
              {chars.last.map((ch, i) => {
                const g = i + FIRST.length;
                const isLocked = g < locked;
                return (
                  <motion.span
                    key={i}
                    className="font-bold"
                    style={{ display: "inline-block", letterSpacing: "-0.02em" }}
                    animate={isLocked ? { color: "hsl(var(--primary))" } : { color: "hsl(var(--primary)/0.35)" }}
                    transition={{ duration: 0.05 }}
                  >
                    {isLocked ? LAST[i] : ch}
                  </motion.span>
                );
              })}
            </div>

            {/* Underline once fully locked */}
            <motion.div
              className="h-[3px] bg-primary rounded-full mt-5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={allLocked ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              style={{ transformOrigin: "left", width: "100%" }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>

          {/* Progress bar at bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(locked / TOTAL) * 100}%` }}
              transition={{ duration: 0.07, ease: "linear" }}
            />
          </div>

          {/* Blinking cursor following the lock */}
          {!allLocked && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
              <span className="font-mono text-xs text-muted-foreground tracking-widest">
                {locked < FIRST.length ? "DECODING..." : "CONFIRMING..."}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
