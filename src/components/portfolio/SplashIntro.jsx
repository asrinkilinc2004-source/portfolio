import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";
const rnd      = () => POOL[Math.floor(Math.random() * POOL.length)];
const rndRange = (min, max) => Math.random() * (max - min) + min;

const FIRST = "ASRIN";
const LAST  = "KILINC";
const TOTAL = FIRST.length + LAST.length;

const GLITCH_SCHEDULE = [80, 200, 320, 440, 560, 640, 720, 810];

// Pre-computed shatter slice configs — alternating left/right
const SHATTER = [
  { x: "-130vw", rotate: -9,  delay: 0    },
  { x:  "125vw", rotate:  7,  delay: 0.04 },
  { x: "-118vw", rotate: -12, delay: 0.02 },
  { x:  "132vw", rotate:  8,  delay: 0.06 },
  { x: "-125vw", rotate: -7,  delay: 0.01 },
  { x:  "118vw", rotate:  11, delay: 0.05 },
  { x: "-132vw", rotate: -10, delay: 0.03 },
  { x:  "122vw", rotate:  9,  delay: 0.07 },
];
const N_SLICES = SHATTER.length;

export default function SplashIntro({ onDone }) {
  const [show,          setShow]          = useState(false);
  const [wipeOut,       setWipeOut]       = useState(false);
  const [slicesActive,  setSlicesActive]  = useState(false);
  const [locked,        setLocked]        = useState(0);
  const [chars,         setChars]         = useState(() => ({
    first: FIRST.split("").map(rnd),
    last:  LAST.split("").map(rnd),
  }));
  const [glitch,    setGlitch]    = useState(false);
  const [chromatic, setChromatic] = useState(false);
  const [slice,     setSlice]     = useState(null);

  const triggerGlitch = useCallback((intensity = 1) => {
    const dur = 55 + rndRange(0, 90) * intensity;
    setGlitch(true);
    setChromatic(true);
    setSlice({ y: rndRange(15, 70), h: rndRange(8, 22), shift: rndRange(-14, 14) * intensity });
    setTimeout(() => {
      setGlitch(false);
      setChromatic(false);
      setSlice(null);
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
      scrambleId = setInterval(() => {
        setChars({
          first: FIRST.split("").map((c, i) => i < Math.min(lockedCount, FIRST.length) ? c : rnd()),
          last:  LAST.split("").map((c, i) => {
            const g = i + FIRST.length;
            return g < lockedCount ? c : rnd();
          }),
        });
      }, 40);

      GLITCH_SCHEDULE.forEach((delay, idx) => {
        const t = setTimeout(() => triggerGlitch(idx < 3 ? 1.2 : 0.8), delay);
        timeouts.push(t);
      });

      const randId = setInterval(() => {
        if (Math.random() > 0.35) triggerGlitch(0.7);
      }, 220);
      timeouts.push(randId);

      lockId = setInterval(() => {
        lockedCount++;
        setLocked(lockedCount);
        if (lockedCount >= TOTAL) {
          clearInterval(lockId);
          clearInterval(scrambleId);
          timeouts.forEach(clearTimeout);

          // Shake
          setTimeout(() => setWipeOut(true), 550);
          // Slices fly + homepage starts
          setTimeout(() => { setSlicesActive(true); onDone?.(); }, 900);
          // Remove from DOM
          setTimeout(() => setShow(false), 1650);
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

  const bgStyles = {
    backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
    backgroundSize: "60px 60px",
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Main splash — shakes on wipeOut, hides when slices take over */}
          <motion.div
            className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center gap-6 overflow-hidden"
            style={{ pointerEvents: "none" }}
            animate={
              slicesActive ? { opacity: 0 } :
              wipeOut ? {
                x: [0, -18, 14, -12, 9, -6, 4, -2, 0],
                y: [0,   4,  -3,   5, -3,  4, -2,  2, 0],
                scale: [1, 1.03, 0.98, 1.02, 0.99, 1.01, 1],
              } : { x: 0, y: 0, opacity: 1, scale: 1 }
            }
            transition={
              slicesActive ? { duration: 0.08 } :
              wipeOut ? { duration: 0.38, ease: "easeInOut" } : {}
            }
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={bgStyles} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.55) 2px, rgba(0,0,0,0.55) 4px)", opacity: 0.07 }}
            />

            <motion.div
              className="relative flex flex-col items-center select-none"
              animate={glitch ? {
                x: [0, rndRange(-8, 8), rndRange(-5, 5), rndRange(-3, 3), 0],
                skewX: [0, rndRange(-3, 3), rndRange(-1, 1), 0],
              } : { x: 0, skewX: 0 }}
              transition={{ duration: 0.09, ease: "linear" }}
            >
              {renderName()}
              <motion.div
                className="h-[3px] bg-primary rounded-full mt-5"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={allLocked ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                style={{ transformOrigin: "left", width: "100%" }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.div>

            {slice && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none select-none"
                style={{
                  clipPath: `polygon(0 ${slice.y}%, 100% ${slice.y}%, 100% ${slice.y + slice.h}%, 0 ${slice.y + slice.h}%)`,
                  transform: `translateX(${slice.shift}px)`,
                  mixBlendMode: "screen", opacity: 0.65,
                }}>
                {renderName(1)}
              </div>
            )}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-border rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full"
                animate={{ width: `${(locked / TOTAL) * 100}%` }}
                transition={{ duration: 0.07, ease: "linear" }}
              />
            </div>

            {!allLocked && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <motion.span className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                <motion.span className="font-mono text-xs text-muted-foreground tracking-widest"
                  animate={glitch ? { x: [0, -3, 3, 0], opacity: [1, 0.3, 1] } : { x: 0, opacity: 1 }}
                  transition={{ duration: 0.09 }}>
                  {locked < FIRST.length ? "DECODING..." : "CONFIRMING..."}
                </motion.span>
              </div>
            )}
          </motion.div>

          {/* Shatter slices — each a clipped copy of the splash that flies off */}
          {slicesActive && SHATTER.map((cfg, i) => {
            const slicePct = 100 / N_SLICES;
            const top    = i * slicePct;
            const bottom = 100 - (i + 1) * slicePct;
            return (
              <motion.div
                key={i}
                className="fixed inset-0 z-[201] bg-background flex flex-col items-center justify-center gap-6 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(${top}% 0% ${bottom}% 0%)` }}
                initial={{ x: 0, rotate: 0, opacity: 1 }}
                animate={{ x: cfg.x, rotate: cfg.rotate, opacity: 0 }}
                transition={{ duration: 0.6, delay: cfg.delay, ease: [0.55, 0, 1, 0.45] }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={bgStyles} />
                <div className="flex flex-col items-center select-none gap-6">
                  {renderName()}
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </AnimatePresence>
  );
}
