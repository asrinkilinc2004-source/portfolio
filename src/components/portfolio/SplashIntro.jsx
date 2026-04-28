import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pre-compute random start positions once per page load
const makeLetters = (word) =>
  word.split("").map((char) => ({
    char,
    y:      (Math.random() > 0.5 ? -1 : 1) * (60 + Math.random() * 100),
    x:      (Math.random() - 0.5) * 70,
    rotate: (Math.random() - 0.5) * 55,
    scale:  0.3 + Math.random() * 0.4,
  }));

const FIRST = makeLetters("Asrin");
const LAST  = makeLetters("Kilinc");

const SPRING = { type: "spring", stiffness: 200, damping: 14, mass: 0.8 };

export default function SplashIntro({ onDone }) {
  const [show,   setShow]   = useState(false);
  const [wipeOut, setWipeOut] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("splash")) {
      sessionStorage.setItem("splash", "1");
      setShow(true);
      // Start wipe after letters have settled
      const t1 = setTimeout(() => setWipeOut(true), 1700);
      // Notify parent when fully gone
      const t2 = setTimeout(() => { setShow(false); onDone?.(); }, 2400);
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
          animate={wipeOut ? { y: "-100%" } : { y: 0 }}
          transition={wipeOut ? { duration: 0.65, ease: [0.76, 0, 0.24, 1] } : {}}
        >
          {/* Subtle grid (matches hero) */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative flex flex-col items-center gap-1 select-none">
            {/* "Asrin" */}
            <motion.div
              className="flex"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {FIRST.map(({ char, y, x, rotate, scale }, i) => (
                <motion.span
                  key={i}
                  className="text-[clamp(3rem,12vw,7rem)] font-bold text-foreground leading-none tracking-tight"
                  variants={{
                    hidden:  { y, x, rotate, scale, opacity: 0 },
                    visible: { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1, transition: SPRING },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* "Kilinc" */}
            <motion.div
              className="flex"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }}
            >
              {LAST.map(({ char, y, x, rotate, scale }, i) => (
                <motion.span
                  key={i}
                  className="text-[clamp(3rem,12vw,7rem)] font-bold text-primary leading-none tracking-tight"
                  variants={{
                    hidden:  { y, x, rotate, scale, opacity: 0 },
                    visible: { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1, transition: SPRING },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Underline that draws itself after letters land */}
            <motion.div
              className="h-[3px] bg-primary rounded-full mt-3"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
