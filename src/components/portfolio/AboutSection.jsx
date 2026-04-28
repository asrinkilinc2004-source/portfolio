import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, GraduationCap, Lightbulb, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";

const ICONS = [Lightbulb, GraduationCap, Code2, Rocket];
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

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutSection() {
  const { t } = useLanguage();
  const { label, title, p1, p2, highlights, stats } = t.about;

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            <span className="marker-highlight">
              <SplitText text={title} delay={0.3} />
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div {...fadeUp(0.1)}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{p1}</p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">{p2}</p>

            {/* Stat counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border">
              {stats.map(({ value, suffix, label: statLabel }, i) => (
                <motion.div key={i} {...fadeUp(0.15 + i * 0.07)} className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-primary font-mono">
                    <CountUp value={value} suffix={suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono tracking-wider">{statLabel}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map(({ label: hl, desc }, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div key={hl} {...fadeUp(0.1 * i)}>
                  <TiltCard className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group h-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{hl}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
