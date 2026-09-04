import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeLeft, fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";

export default function EducationSection() {
  const { t } = useLanguage();
  const { label, title, timeline } = t.education;
  const containerRef = useRef(null);
  const [planeKey, setPlaneKey] = useState(0);
  const [planeY, setPlaneY] = useState(300);
  const [flying, setFlying] = useState(false);

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

  const handleWismonHover = (e) => {
    if (flying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPlaneY(Math.round(rect.top + rect.height / 2 - 24));
    setFlying(true);
    setPlaneKey((k) => k + 1);
  };

  return (
    <section id="education" className="py-32 px-6">

      <AnimatePresence>
        {flying && (
          <motion.img
            key={planeKey}
            src="/plane.png"
            alt=""
            style={{
              position: "fixed",
              top: planeY,
              left: 0,
              zIndex: 9999,
              pointerEvents: "none",
              width: 120,
              height: "auto",
            }}
            initial={{ x: -160 }}
            animate={{ x: typeof window !== "undefined" ? window.innerWidth + 160 : 2000 }}
            exit={{}}
            transition={{ duration: 3.5, ease: "linear" }}
            onAnimationComplete={() => setFlying(false)}
          />
        )}
      </AnimatePresence>

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
                  onMouseEnter={isWismon ? handleWismonHover : undefined}
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
