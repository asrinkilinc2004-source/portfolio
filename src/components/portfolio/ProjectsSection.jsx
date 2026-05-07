import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";
import SplitText from "./SplitText";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// Per-project image overrides (index-based, language-independent)
// Order: DOKKI€ (0), SafeNotes (1), Rituals (2), Defensie (3), AI Camera (4)
const IMAGE_CLASS = [
  "group-hover:scale-105",
  "group-hover:scale-105",
  "group-hover:scale-105",
  "scale-[1.22] group-hover:scale-[1.28]", // Defensie — zoom to hide black borders
  "group-hover:scale-105",
];

function TiltCard({ project, index, currentLabel, viewCurrentLabel }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transition = "transform 0.05s linear";
    el.style.transform  = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 6}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform  = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };

  const hasImage = !!project.image;

  return (
    <motion.div {...fadeUp(index * 0.08)}>
      <div ref={ref}
        onMouseMove={isMobile ? undefined : onMove}
        onMouseLeave={isMobile ? undefined : onLeave}
        className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-colors duration-300"
        style={{ willChange: "transform" }}>
        <div className="flex flex-col lg:flex-row">

          {/* Image / placeholder */}
          <div className="lg:w-1/2 overflow-hidden relative">
            {hasImage ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-56 lg:h-full object-cover transition-transform duration-500 ${IMAGE_CLASS[index] ?? "group-hover:scale-105"}`}
              />
            ) : (
              /* Animated gradient placeholder for projects without a screenshot yet */
              <div className="w-full h-56 lg:h-full min-h-[14rem] flex items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)/0.08) 0%, hsl(var(--primary)/0.18) 50%, hsl(var(--primary)/0.06) 100%)",
                }}>
                {/* Slow drifting glow */}
                <div className="absolute inset-0 opacity-40"
                  style={{
                    background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--primary)/0.3) 0%, transparent 70%)",
                    animation: "pulse 3s ease-in-out infinite",
                  }}
                />
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {/* "In progress" icon area */}
                <div className="relative flex flex-col items-center gap-3 select-none">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs text-primary/50 tracking-widest uppercase">In progress</span>
                </div>
              </div>
            )}
            {/* Gradient slide-up overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/50 via-primary/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
          </div>

          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
            {/* Semester tag row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-block font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1 w-fit">
                {project.semester}
              </span>
              {project.current && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-md px-2 py-1 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  {currentLabel}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/15 transition-colors">{tag}</span>
              ))}
            </div>
            {project.current && (
              <button
                onClick={() => navigate("/semester4")}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-150 w-fit"
              >
                {viewCurrentLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { t } = useLanguage();
  const { label, title, items, current_label, view_current } = t.projects;

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            <span className="marker-highlight">
              <SplitText text={title} delay={0.3} />
            </span>
          </h2>
        </motion.div>
        <div className="space-y-8">
          {items.map((project, i) => (
            <TiltCard key={project.title} project={project} index={i} currentLabel={current_label} viewCurrentLabel={view_current} />
          ))}
        </div>
      </div>
    </section>
  );
}
