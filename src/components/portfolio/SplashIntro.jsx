import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Keep the first visit immediate, with only a short branded opening moment.
export default function SplashIntro({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 520);
    const doneTimer = setTimeout(() => onDone?.(), 760);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center gap-3 select-none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="font-mono text-sm font-semibold tracking-[0.28em] text-foreground">
              ASRIN KILINC
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
