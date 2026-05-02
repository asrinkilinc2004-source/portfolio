import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeLeft, fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";

function DotWithGlow({ index, total, progress }) {
  const peak  = (index + 0.5) / total;
  const half  = 0.38 / total;

  const boxShadow = useTransform(
    progress,
    [Math.max(0, peak - half), peak, Math.min(1, peak + half)],
    [
      "0 0 0px 0px transparent",
      "0 0 18px 6px hsl(var(--primary) / 0.85)",
      "0 0 0px 0px transparent",
    ]
  );

  return (
    <div className="absolute left-3 md:left-6 top-1 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
      <motion.div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow }} />
    </div>
  );
}

export default function EducationSection() {
  const { t } = useLanguage();
  const { label, title, timeline } = t.education;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const scaleY   = useTransform(smoothProgress, [0, 1], [0, 1]);
  const arrowTop = useTransform(smoothProgress, v => `${v * 100}%`);

  return (
    <section id="education" className="py-32 px-6">
      {/* Sketchy SVG displacement filter */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="sketchy-line" x="-40%" width="180%" y="0%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.008" numOctaves="3" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            <span className="marker-highlight"><SplitText text={title} delay={0.3} /></span>
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Sketchy animated line */}
          <motion.div
            className="absolute left-5 md:left-8 top-0 bottom-0 origin-top"
            style={{
              scaleY,
              width: "2px",
              background: "hsl(var(--foreground) / 0.28)",
              filter: "url(#sketchy-line)",
            }}
          />

          {/* Arrowhead following the tip */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[13px] md:left-[26px] -translate-x-1/2 -translate-y-full"
            style={{ top: arrowTop }}
          >
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M0.5 0.5L5.5 7L10.5 0.5" stroke="hsl(var(--foreground) / 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <motion.div key={i} {...fadeLeft(i * 0.08)} className="relative pl-16 md:pl-20 group">
                <DotWithGlow index={i} total={timeline.length} progress={smoothProgress} />
                <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                <h3 className="text-xl font-bold mt-1 mb-1"><span className="marker-highlight-group">{item.title}</span></h3>
                <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
