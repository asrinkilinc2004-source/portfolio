import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

// Per-project image overrides (index-based, language-independent)
// Order: VistaTelecom (0), AI Camera (1), Defensie (2), Rituals (3), SafeNotes (4), DOKKI€ (5)
const IMAGE_CLASS = [
  "group-hover:scale-105",
  "group-hover:scale-105",
  "scale-[1.22] group-hover:scale-[1.28]", // Defensie — zoom to hide black borders
  "group-hover:scale-105",
  "group-hover:scale-105",
  "group-hover:scale-105",
];

function ProjectCard({ project, index, viewCurrentLabel }) {
  const navigate = useNavigate();
  const hasImage = !!project.image;

  return (
    <motion.div {...fadeUp(index * 0.08)} id={project.link === "/semester4" ? "ai-project" : undefined}>
      <div className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-colors duration-300"
        style={{ boxShadow: "inset 0 4px 0 0 hsl(var(--primary) / 0.7)" }}>
        <div className="flex flex-col lg:flex-row">

          {/* Image / placeholder */}
          <div className="lg:w-1/2 overflow-hidden relative">
            {hasImage && project.link === "/semester5" ? (
              <div className="w-full h-56 lg:h-full min-h-[14rem] flex items-center justify-center bg-white p-8">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : hasImage ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-56 lg:h-full object-cover transition-transform duration-500 ${IMAGE_CLASS[index] ?? "group-hover:scale-105"}`}
              />
            ) : project.link === "/semester4" ? (
              /* Semester 4 — static AI/camera placeholder */
              <div className="w-full h-56 lg:h-full min-h-[14rem] flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--primary)/0.2) 100%)" }}>
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="relative w-14 h-14 rounded-full border-2 border-primary/30 flex items-center justify-center bg-background/40">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
              </div>
            ) : (
              /* Placeholder for other projects without a screenshot yet */
              <div className="w-full h-56 lg:h-full min-h-[14rem] flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08) 0%, hsl(var(--primary)/0.18) 100%)" }}>
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
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
          </div>

          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-block font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1 w-fit">
                {project.semester}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20">{tag}</span>
              ))}
            </div>
            {project.link && (
              <button
                onClick={() => navigate(project.link)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-300 w-fit"
              >
                {project.viewBtn || viewCurrentLabel}
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
  const { label, title, items, view_current } = t.projects;

  return (
    <section id="projects" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">{title}</h2>
        </motion.div>
        <div className="space-y-8">
          {items.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} viewCurrentLabel={view_current} />
          ))}
        </div>
      </div>
    </section>
  );
}
