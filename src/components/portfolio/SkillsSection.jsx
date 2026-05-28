import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";
import Marquee from "./Marquee";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transition = "transform 0.05s linear";
    el.style.transform  = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale3d(1.03,1.03,1.03)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform  = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };
  return (
    <div ref={ref} onMouseMove={isMobile ? undefined : onMove} onMouseLeave={isMobile ? undefined : onLeave}
      className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

function StaggeredSkills({ skills }) {
  const containerRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    animated.current = false;

    const tags = Array.from(container.querySelectorAll(".skill-tag"));
    tags.forEach((tag) => {
      tag.style.opacity = "0";
      tag.style.transform = "translateY(10px) scale(0.88)";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animate(tags, {
            opacity: [0, 1],
            translateY: [10, 0],
            scale: [0.88, 1],
            duration: 420,
            delay: stagger(50),
            ease: "spring(1, 90, 12, 0)",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [skills]);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="skill-tag px-3 py-1.5 text-sm rounded-md bg-secondary text-secondary-foreground border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

export default function SkillsSection() {
  const { t } = useLanguage();
  const { label, title, categories } = t.skills;

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-6">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            <span className="marker-highlight">
              <SplitText text={title} delay={0.3} />
            </span>
          </h2>
        </motion.div>

        {/* Infinite marquee */}
        <Marquee />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.title} {...fadeUp(i * 0.08)}>
              <TiltCard className="p-6 rounded-xl bg-card border border-border h-full">
                <h3 className="font-mono text-sm text-primary mb-5 tracking-wider">{cat.title}</h3>
                <StaggeredSkills skills={cat.skills} />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
