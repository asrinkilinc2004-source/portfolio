import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";
const rnd      = () => POOL[Math.floor(Math.random() * POOL.length)];
const rndRange = (min, max) => Math.random() * (max - min) + min;

const FIRST = "ASRIN";
const LAST  = "KILINC";
const TOTAL = FIRST.length + LAST.length;

// Guaranteed glitch burst timings (ms after boot) — always fire
const GLITCH_SCHEDULE = [80, 200, 320, 440, 560, 640, 720, 810];

export default function SplashIntro({ onDone }) {
  const [show,       setShow]       = useState(false);
  const [wipeOut,    setWipeOut]    = useState(false);
  const [locked,     setLocked]     = useState(0);
  const [chars,      setChars]      = useState(() => ({
    first: FIRST.split("").map(rnd),
    last:  LAST.split("").map(rnd),
  }));
  const [glitch,     setGlitch]     = useState(false);
  const [chromatic,  setChromatic]  = useState(false);
  const [slice,      setSlice]      = useState(null); // { y, h, shift }

  const triggerGlitch = useCallback((intensity = 1) => {
    const dur = 55 + rndRange(0, 90) * intensity;

    setGlitch(true);
    setChromatic(true);

    // VHS slice: random horizontal band that shifts sideways
    setSlice({
      y:     rndRange(15, 70),            // % from top
      h:     rndRange(8, 22),             // % height
      shift: rndRange(-14, 14) * intensity,
    });

    setTimeout(() => {
      setGlitch(false);
      setChromatic(false);
      setSlice(null);

      // Second micro-flash 40% of the time
      if (Math.random() > 0.6) {
        setTimeout(() => {
          setGlitch(true);
          setChromatic(true);
          setSlice({ y: rndRange(10, 80), h: rndRange(5, 14), shift: rndRange(-8, 8) });
          setTimeout(() => { setGlitch(false); setChromatic(false); setSlice(null); }, 45);
        }, 55 + rndRange(0, 40));
      }
    }, dur);
  }, []);

  useEffect(() => {
    setShow(true);

    let lockedCount = 0;
    let lockId, scrambleId;
    const timeouts = [];

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

      // Guaranteed glitch schedule — always fires
      GLITCH_SCHEDULE.forEach((delay, idx) => {
        const t = setTimeout(() => triggerGlitch(idx < 3 ? 1.2 : 0.8), delay);
        timeouts.push(t);
      });

      // Extra random glitches on top
      const randId = setInterval(() => {
        if (Math.random() > 0.35) triggerGlitch(0.7);
      }, 220);
      timeouts.push(randId);

      // Lock one char every 75ms
      lockId = setInterval(() => {
        lockedCount++;
        setLocked(lockedCount);
        if (lockedCount >= TOTAL) {
          clearInterval(lockId);
          clearInterval(scrambleId);
          timeouts.forEach(clearTimeout);
          setTimeout(() => setWipeOut(true), 550);
          setTimeout(() => { setShow(false); onDone?.(); }, 1320);
        }
      }, 75);
    }, 350);

    return () => {
      clearTimeout(boot);
      clearInterval(lockId);
      clearInterval(scrambleId);
      timeouts.forEach(clearTimeout);
    };
  }, [triggerGlitch]);

  const allLocked = locked >= TOTAL;

  // Shared name render — used for main layer + slice ghost
  const renderName = (opacity = 1) => (
    <>
      <div className="flex" style={{ fontSize: "clamp(3.5rem,13vw,8.5rem)", lineHeight: 1 }}>
        {chars.first.map((ch, i) => {
          const isLocked = i < locked;
          return (
            <motion.span key={i} className="font-bold"
              style={{
                display: "inline-block", letterSpacing: "-0.02em", opacity,
                textShadow: chromatic
                  ? isLocked
                    ? "3px 0 rgba(255,30,80,0.6), -3px 0 rgba(0,255,200,0.6)"
                    : "5px 0 rgba(255,30,80,0.9), -5px 0 rgba(0,255,200,0.9)"
                  : "none",
              }}
              animate={isLocked
                ? { color: "hsl(var(--foreground))", y: 0 }
                : { color: "hsl(var(--primary)/0.4)", y: [0, rndRange(-3, 3), 0] }
              }
              transition={{ duration: 0.05 }}>
              {isLocked ? FIRST[i] : ch}
            </motion.span>
          );
        })}
      </div>
      <div className="flex" style={{ fontSize: "clamp(3.5rem,13vw,8.5rem)", lineHeight: 1 }}>
        {chars.last.map((ch, i) => {
          const g = i + FIRST.length;
          const isLocked = g < locked;
          return (
            <motion.span key={i} className="font-bold"
              style={{
                display: "inline-block", letterSpacing: "-0.02em", opacity,
                textShadow: chromatic
                  ? isLocked
                    ? "3px 0 rgba(255,30,80,0.6), -3px 0 rgba(0,255,200,0.6)"
                    : "5px 0 rgba(255,30,80,0.9), -5px 0 rgba(0,255,200,0.9)"
                  : "none",
              }}
              animate={isLocked
                ? { color: "hsl(var(--primary))", y: 0 }
                : { color: "hsl(var(--primary)/0.35)", y: [0, rndRange(-3, 3), 0] }
              }
              transition={{ duration: 0.05 }}>
              {isLocked ? LAST[i] : ch}
            </motion.span>
          );
        })}
      </div>
    </>
  );

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
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.55) 2px, rgba(0,0,0,0.55) 4px)",
              opacity: 0.07,
            }}
          />

          {/* Main name block */}
          <motion.div
            className="relative flex flex-col items-center select-none"
            animate={glitch ? {
              x: [0, rndRange(-8, 8), rndRange(-5, 5), rndRange(-3, 3), 0],
              skewX: [0, rndRange(-3, 3), rndRange(-1, 1), 0],
            } : { x: 0, skewX: 0 }}
            transition={{ duration: 0.09, ease: "linear" }}
          >
            {renderName()}

            {/* Underline */}
            <motion.div
              className="h-[3px] bg-primary rounded-full mt-5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={allLocked ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              style={{ transformOrigin: "left", width: "100%" }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>

          {/* VHS slice ghost — clips a horizontal band and shifts it */}
          {slice && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none select-none"
              style={{
                clipPath: `polygon(0 ${slice.y}%, 100% ${slice.y}%, 100% ${slice.y + slice.h}%, 0 ${slice.y + slice.h}%)`,
                transform: `translateX(${slice.shift}px)`,
                mixBlendMode: "screen",
                opacity: 0.65,
              }}
            >
              {renderName(1)}
            </div>
          )}

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
                animate={glitch ? { x: [0, -3, 3, 0], opacity: [1, 0.3, 1] } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.09 }}
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
