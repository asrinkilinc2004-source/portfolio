import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Give fonts and the hero photo a short, bounded preparation window.
export default function SplashIntro({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let minimumTimer;
    let maximumTimer;
    const photo = new Image();
    photo.src = "/ik.png";
    const minimum = new Promise(resolve => { minimumTimer = setTimeout(resolve, 1500); });
    const maximum = new Promise(resolve => { maximumTimer = setTimeout(resolve, 3000); });
    const assets = Promise.allSettled([document.fonts.ready, photo.decode()]);
    Promise.all([minimum, Promise.race([assets, maximum])]).then(() => {
      if (cancelled) return;
      clearTimeout(maximumTimer);
      setLeaving(true);
    });

    return () => {
      cancelled = true;
      clearTimeout(minimumTimer);
      clearTimeout(maximumTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          role="status"
          aria-label="Portfolio laden"
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
