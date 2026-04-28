import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pre-compute random start data once per page load
const mkLetter = (char) => ({
  char,
  fromY:    (Math.random() > 0.5 ? -1 : 1) * (120 + Math.random() * 180),
  fromX:    (Math.random() - 0.5) * 90,
  rotate:   (Math.random() - 0.5) * 70,
  duration: 0.65 + Math.random() * 0.25,
});

const FIRST = "Asrin".split("").map(mkLetter);
const LAST  = "Kilinc".split("").map(mkLetter);

// Gelly squash-and-stretch keyframes (cartoon physics)
const gelly = ({ fromY, fromX, rotate, duration }) => ({
  hidden: { y: fromY, x: fromX, rotate, scaleX: 0.35, scaleY: 0.35, opacity: 0 },
  visible: {
    y:      [fromY, fromY * 0.08, -22, 8, -4, 0],
    x:      [fromX, fromX * 0.2, 0, 0, 0, 0],
    scaleX: [0.35, 0.85, 1.55, 0.82, 1.08, 1],   // squash wide on impact
    scaleY: [0.35, 1.15, 0.48, 1.28, 0.92, 1],   // flatten then stretch tall
    rotate: [rotate, rotate * 0.25, 0, 0, 0, 0],
    opacity:[0, 0.7, 1, 1, 1, 1],
    transition: {
      duration,
      times: [0, 0.32, 0.52, 0.68, 0.82, 1],
      ease: "easeOut",
    },
  },
});

export default function SplashIntro({ onDone }) {
  const [show,    setShow]    = useState(false);
  const [wipeOut, setWipeOut] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("splash")) {
      sessionStorage.setItem("splash", "1");
      setShow(true);
      const t1 = setTimeout(() => setWipeOut(true), 1900);
      const t2 = setTimeout(() => { setShow(false); onDone?.(); }, 2650);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      onDone?.();
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center overflow-hidden"
          animate={wipeOut ? { y: "-102%" } : { y: 0 }}
          transition={wipeOut
            ? { duration: 0.72, ease: [0.76, 0, 0.24, 1] }
            : {}}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative flex flex-col items-center gap-0 select-none" style={{ perspective: 800 }}>
            {/* "Asrin" */}
            <motion.div
              className="flex"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
            >
              {FIRST.map((d, i) => (
                <motion.span
                  key={i}
                  custom={d}
                  variants={gelly(d)}
                  className="font-bold text-foreground leading-none"
                  style={{ fontSize: "clamp(3.5rem, 13vw, 8rem)", display: "inline-block", letterSpacing: "-0.02em" }}
                >
                  {d.char}
                </motion.span>
              ))}
            </motion.div>

            {/* "Kilinc" in primary */}
            <motion.div
              className="flex"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.38 } } }}
            >
              {LAST.map((d, i) => (
                <motion.span
                  key={i}
                  custom={d}
                  variants={gelly(d)}
                  className="font-bold text-primary leading-none"
                  style={{ fontSize: "clamp(3.5rem, 13vw, 8rem)", display: "inline-block", letterSpacing: "-0.02em" }}
                >
                  {d.char}
                </motion.span>
              ))}
            </motion.div>

            {/* Underline draws after letters settle */}
            <motion.div
              className="h-[3px] bg-primary rounded-full mt-4"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              style={{ transformOrigin: "left", width: "100%" }}
              transition={{ delay: 1.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
