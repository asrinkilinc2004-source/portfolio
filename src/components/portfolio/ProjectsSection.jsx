import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// Per-project image overrides (index-based, language-independent)
const IMAGE_CLASS = [
  "scale-[1.22] group-hover:scale-[1.28]", // Defensie — zoom to hide black borders
  "group-hover:scale-105",
  "group-hover:scale-105",
  "group-hover:scale-105",
];

function TiltCard({ project, index }) {
  const ref = useRef(null);
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

  return (
    <motion.div {...fadeUp(index * 0.08)}>
      <div ref={ref}
        onMouseMove={isMobile ? undefined : onMove}
        onMouseLeave={isMobile ? undefined : onLeave}
        className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-colors duration-300"
        style={{ willChange: "transform" }}>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-full h-56 lg:h-full object-cover transition-transform duration-500 ${IMAGE_CLASS[index] ?? "group-hover:scale-105"}`}
            />
          </div>
          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
            <span className="inline-block font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1 mb-3 w-fit">
              {project.semester}
            </span>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { t } = useLanguage();
  const { label, title, items } = t.projects;

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight"><span className="marker-highlight">{title}</span></h2>
        </motion.div>
        <div className="space-y-8">
          {items.map((project, i) => <TiltCard key={project.title} project={project} index={i} />)}
        </div>
      </div>
    </section>
  );
}
