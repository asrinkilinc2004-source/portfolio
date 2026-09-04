import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeLeft, fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";

export default function EducationSection() {
  const { t } = useLanguage();
  const { label, title, timeline } = t.education;
  const containerRef = useRef(null);
  const [planeFly, setPlaneFly] = useState(false);
  const [planeY,   setPlaneY]   = useState(0);

  const flyPlane = (e) => {
    if (planeFly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPlaneY(rect.top + rect.height / 2 - 20);
    setPlaneFly(true);
  };

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
      {planeFly && (
        <motion.div
          style={{
            position: "fixed",
            top: planeY,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
            color: "hsl(var(--primary))",
            filter: "drop-shadow(0 2px 8px hsl(197 100% 44% / 0.5))",
          }}
          initial={{ x: -120 }}
          animate={{ x: window.innerWidth + 120 }}
          transition={{ duration: 3, ease: "linear" }}
          onAnimationComplete={() => setPlaneFly(false)}
        >
          <svg width="110" height="44" viewBox="0 0 200 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            {/* Fuselage */}
            <path d="M10,40 Q16,34 185,34 Q197,40 185,46 Q16,46 10,40Z"/>
            {/* Main wings */}
            <path d="M92,36 L142,6 L147,11 L102,36 L102,44 L147,69 L142,74 L92,44Z"/>
            {/* Engine pod */}
            <ellipse cx="118" cy="52" rx="21" ry="5.5"/>
            {/* Tail vertical fin */}
            <path d="M24,34 L24,16 L40,34Z"/>
            {/* Tail horizontal stabilizers */}
            <path d="M30,36 L12,21 L12,26 L24,36 L24,44 L12,54 L12,59 L30,44Z"/>
          </svg>
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
                <motion.div key={i} {...fadeLeft(i * 0.08)} className="relative pl-16 md:pl-20 group">
                  <div className="absolute left-3 md:left-6 top-1 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div onMouseEnter={isWismon ? flyPlane : undefined}>
                    <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1 mb-1"><span className="marker-highlight-group">{item.title}</span></h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
