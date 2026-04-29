import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";
const rnd      = () => POOL[Math.floor(Math.random() * POOL.length)];
const rndRange = (min, max) => Math.random() * (max - min) + min;

const FIRST = "ASRIN";
const LAST  = "KILINC";
const TOTAL = FIRST.length + LAST.length; // 11

export default function SplashIntro({ onDone }) {
  const [show,      setShow]      = useState(false);
  const [wipeOut,   setWipeOut]   = useState(false);
  const [locked,    setLocked]    = useState(0);
  const [chars,     setChars]     = useState(() => ({
    first: FIRST.split("").map(rnd),
    last:  LAST.split("").map(rnd),
  }));
  const [glitch,    setGlitch]    = useState(false);
  const [chromatic, setChromatic] = useState(false);
  const [flash,     setFlash]     = useState(false);

  useEffect(() => {
    setShow(true);

    let lockedCount = 0;
    let lockId, scrambleId, glitchId, flashId;

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

      // Random glitch bursts: displacement + chromatic aberration
      glitchId = setInterval(() => {
        if (Math.random() > 0.55) {
          setGlitch(true);
          setChromatic(true);
          const dur = 60 + Math.random() * 110;
          setTimeout(() => { setGlitch(false); setChromatic(false); }, dur);
          // Occasional double-flash
          if (Math.random() > 0.6) {
            setTimeout(() => {
              setGlitch(true);
              setChromatic(true);
              setTimeout(() => { setGlitch(false); setChromatic(false); }, 50);
            }, dur + 70);
          }
        }
      }, 280);

      // Rare full-screen tinted flash
      flashId = setInterval(() => {
        if (Math.random() > 0.72) {
          setFlash(true);
          setTimeout(() => setFlash(false), 35);
        }
      }, 480);

      // Lock one char every 75ms
      lockId = setInterval(() => {
        lockedCount++;
        setLocked(lockedCount);
        if (lockedCount >= TOTAL) {
          clearInterval(lockId);
          clearInterval(scrambleId);
          clearInterval(glitchId);
          clearInterval(flashId);
          setTimeout(() => setWipeOut(true), 550);
          setTimeout(() => { setShow(false); onDone?.(); }, 1320);
        }
      }, 75);
    }, 350);

    return () => {
      clearTimeout(boot);
      clearInterval(lockId);
      clearInterval(scrambleId);
      clearInterval(glitchId);
      clearInterval(flashId);
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
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.045]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
            }}
          />

          {/* Full-screen tint flash */}
          {flash && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "hsl(var(--primary)/0.07)", mixBlendMode: "screen" }}
            />
          )}

          {/* Name block — glitch displacement on burst */}
          <motion.div
            className="relative flex flex-col items-center select-none"
            animate={glitch ? {
              x: [0, rndRange(-6, 6), rndRange(-3, 3), 0],
              skewX: [0, rndRange(-2.5, 2.5), 0],
            } : { x: 0, skewX: 0 }}
            transition={{ duration: 0.08, ease: "linear" }}
          >
            {/* First name */}
            <div className="flex" style={{ fontSize: "clamp(3.5rem,13vw,8.5rem)", lineHeight: 1 }}>
              {chars.first.map((ch, i) => {
                const isLocked = i < locked;
                return (
                  <motion.span
                    key={i}
                    className="font-bold"
                    style={{
                      display: "inline-block",
                      letterSpacing: "-0.02em",
                      textShadow: chromatic
                        ? isLocked
                          ? "2px 0 rgba(255,30,80,0.5), -2px 0 rgba(0,255,200,0.5)"
                          : "4px 0 rgba(255,30,80,0.85), -4px 0 rgba(0,255,200,0.85)"
                        : "none",
                    }}
                    animate={isLocked
                      ? { color: "hsl(var(--foreground))", y: 0 }
                      : { color: "hsl(var(--primary)/0.4)", y: [0, rndRange(-2, 2), 0] }
                    }
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
                    style={{
                      display: "inline-block",
                      letterSpacing: "-0.02em",
                      textShadow: chromatic
                        ? isLocked
                          ? "2px 0 rgba(255,30,80,0.5), -2px 0 rgba(0,255,200,0.5)"
                          : "4px 0 rgba(255,30,80,0.85), -4px 0 rgba(0,255,200,0.85)"
                        : "none",
                    }}
                    animate={isLocked
                      ? { color: "hsl(var(--primary))", y: 0 }
                      : { color: "hsl(var(--primary)/0.35)", y: [0, rndRange(-2, 2), 0] }
                    }
                    transition={{ duration: 0.05 }}
                  >
                    {isLocked ? LAST[i] : ch}
                  </motion.span>
                );
              })}
            </div>

            {/* Underline */}
            <motion.div
              className="h-[3px] bg-primary rounded-full mt-5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={allLocked ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              style={{ transformOrigin: "left", width: "100%" }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(locked / TOTAL) * 100}%` }}
              transition={{ duration: 0.07, ease: "linear" }}
            />
          </div>

          {/* Status label */}
          {!allLocked && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
              <motion.span
                className="font-mono text-xs text-muted-foreground tracking-widest"
                animate={glitch ? { x: [0, -2, 2, 0], opacity: [1, 0.4, 1] } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.08 }}
              >
                {locked < FIRST.length ? "DECODING..." : "CONFIRMING..."}
              </motion.span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
