import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeLeft, fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";

export default function EducationSection() {
  const { t } = useLanguage();
  const { label, title, timeline } = t.education;
  const containerRef = useRef(null);

  const [planeActive, setPlaneActive] = useState(false);
  const [planeY, setPlaneY] = useState(200);
  const flyingRef = useRef(false);
  const wismonRef = useRef(null);

  // Imperative event listener — bypasses React synthetic events
  useEffect(() => {
    const el = wismonRef.current;
    if (!el) return;

    const handleEnter = () => {
      if (flyingRef.current) return;
      flyingRef.current = true;
      const rect = el.getBoundingClientRect();
      setPlaneY(rect.top + rect.height / 2 - 22);
      setPlaneActive(true);
    };

    el.addEventListener("mouseenter", handleEnter);
    return () => el.removeEventListener("mouseenter", handleEnter);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setPlaneActive(false);
    flyingRef.current = false;
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section id="education" className="py-32 px-6">

      {/* KLM plane flyover */}
      {planeActive && (
        <motion.div
          style={{
            position: "fixed",
            top: planeY,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
          initial={{ x: -160 }}
          animate={{ x: window.innerWidth + 160 }}
          transition={{ duration: 3.5, ease: "linear" }}
          onAnimationComplete={handleAnimationComplete}
        >
          <img src="/plane.png" alt="" width={120} height={60} style={{ display: "block" }} />
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight"><span className="marker-highlight"><SplitText text={title} delay={0.3} /></span></h2>
        </motion.div>

        <div ref={containerRef} className="relative">
          <motion.div
            className="absolute left-[22px] md:left-[34px] top-0 bottom-0 origin-top"
            style={{ scaleY, width: "2px", background: "hsl(var(--primary) / 0.7)" }}
          />
          <div className="space-y-12">
            {timeline.map((item, i) => {
              const isWismon = item.institution?.includes("Wismon");
              return (
                <motion.div
                  key={i}
                  {...fadeLeft(i * 0.08)}
                  className="relative pl-16 md:pl-20 group"
                  ref={isWismon ? wismonRef : undefined}
                >
                  <div className="absolute left-3 md:left-6 top-1 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                  <h3 className="text-xl font-bold mt-1 mb-1"><span className="marker-highlight-group">{item.title}</span></h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
