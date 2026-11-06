import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar, Cpu, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/portfolio/Navbar";
import ScrollProgressBar from "../components/portfolio/ScrollProgressBar";
import BackToTop from "../components/portfolio/BackToTop";
import Lightbox from "../components/portfolio/Lightbox";
import { LanguageProvider, useLanguage } from "../lib/LanguageContext";
import { useLenis } from "../lib/useLenis";
import { fadeUp } from "../lib/motion";

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
  backgroundSize: "60px 60px",
};

const TAGS = ["AI", "Python", "HTML", "CSS", "OpenCV", "DeepFace", "Figma", "UI-design"];

const TEAM = [
  { name: "Asrin Kilinc",       role: "AI Engineer",              highlight: true },
  { name: "Ramzi Chejjar",      role: "AI Engineer" },
  { name: "Afnaan Makhloufi",   role: "AI Engineer" },
  { name: "Randy Maigua Lema",  role: "Creative Technologist" },
  { name: "Chahid Aouriaghel",  role: "Digital Business Engineer" },
];

const MILESTONE_DONE = [true, true, true, true, true, true];

function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-border bg-card hover:border-primary/40 transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

function Semester4Content() {
  useLenis();
  const navigate = useNavigate();

  const { t } = useLanguage();
  const s = t.semester4;

  const [lightbox, setLightbox] = useState(null); // { src, alt }
  const openImg = useCallback((src, alt) => setLightbox({ src, alt }), []);

  // Always start at top when navigating to this page
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const milestones = s.milestones.map((label, i) => ({ label, done: MILESTONE_DONE[i] }));
  const doneCount  = milestones.filter((m) => m.done).length;

  const infoRows = [
    [s.info.study_label,   s.info.study_value],
    [s.info.school_label,  s.info.school_value],
    [s.info.period_label,  s.info.period_value],
    [s.info.profile_label, s.info.profile_value],
    [s.info.theme_label,   s.info.theme_value],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground lg:pl-64">
      <Lightbox src={lightbox?.src} alt={lightbox?.alt} onClose={() => setLightbox(null)} />

      <Navbar />
      <ScrollProgressBar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[45vh] flex items-end pb-16 px-6 overflow-hidden pt-28">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_STYLE} />

        <div className="relative max-w-6xl mx-auto w-full">
          <motion.div {...fadeUp(0)}>
            <button
              onClick={() => navigate("/", { state: { scrollTo: "ai-project" } })}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {s.back}
            </button>
          </motion.div>

          <motion.div {...fadeUp(0.08)} className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1">
              {s.info.period_value}
            </span>
            <span className="font-mono text-xs text-muted-foreground bg-muted/40 border border-border rounded-md px-2 py-1">
              Dark Tech
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.14)}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            AI Face Tracking<br />
            <span className="text-primary">Camera</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {s.subtitle}{" "}
            <span className="text-primary font-medium">Dark Tech</span>.
          </motion.p>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────── */}
      <section className="relative px-6 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Project photos */}
            <div className="grid grid-cols-2 gap-4">
              {["/webcam1.jpeg", "/webcam2.jpeg"].map((src, i) => (
                <motion.div key={i} {...fadeUp(0.05 + i * 0.07)}>
                  <Card className="overflow-hidden cursor-zoom-in" onClick={() => openImg(src, `AI Face Tracking Camera ${i + 1}`)}>
                    <img
                      src={src}
                      alt={`AI Face Tracking Camera ${i + 1}`}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Over het project */}
            <motion.div {...fadeUp(0.1)}>
              <Card className="p-8 space-y-4">
                <h2 className="text-xl font-bold">{s.about_title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.about_p1}</p>
                <p className="text-muted-foreground leading-relaxed">{s.about_p2}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {s.about_p3.split("Raspberry Pi").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}<strong className="text-foreground">Raspberry Pi</strong>
                      </span>
                    ) : part
                  )}
                </p>
              </Card>
            </motion.div>

            {/* Voortgang */}
            <motion.div {...fadeUp(0.15)}>
              <Card className="p-8 space-y-5">
                <h2 className="text-xl font-bold">{s.progress_title}</h2>
                <div className="space-y-3">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          m.done ? "border-primary bg-primary" : "border-border bg-background"
                        }`}
                      >
                        {m.done && (
                          <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${m.done ? "text-foreground" : "text-muted-foreground"}`}>
                        {m.label}
                      </span>
                      {!m.done && (
                        <span className="font-mono text-xs text-muted-foreground/50 ml-auto">{s.soon}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-mono">{s.progress_label}</span>
                    <span className="font-mono">{doneCount}/{milestones.length}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(doneCount / milestones.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Tech stack */}
            <motion.div {...fadeUp(0.1)}>
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">{s.tech_title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Team */}
            <motion.div {...fadeUp(0.15)}>
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">{s.team_title}</h3>
                </div>
                <div className="space-y-2">
                  {TEAM.map((member, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${
                        member.highlight
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/30"
                      }`}
                    >
                      {member.highlight && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-medium leading-tight ${member.highlight ? "text-primary font-semibold" : "text-foreground"}`}>
                          {member.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground mt-0.5">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Semester info */}
            <motion.div {...fadeUp(0.2)}>
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">{s.info_title}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {infoRows.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-muted-foreground flex-shrink-0">{label}</span>
                      <span className="text-foreground text-right font-medium text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Navigatiekaarten ─────────────────────────────── */}
      <section className="relative px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* AI Systeem */}
            <button
              onClick={() => navigate("/semester4/ai")}
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-300 overflow-hidden text-left"
            >
              <div className="relative p-10 flex flex-col gap-5 h-full min-h-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-mono text-xs text-primary tracking-wider">{s.ai.label}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{s.ai.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-2">{s.ai.intro}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-primary text-sm font-medium">
                  <span>Bekijk rapport</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </button>

            {/* UI/UX Progressie */}
            <button
              onClick={() => navigate("/semester4/uiux")}
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-300 overflow-hidden text-left"
            >
              <div className="relative p-10 flex flex-col gap-5 h-full min-h-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs text-primary tracking-wider">{s.uiux.label}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{s.uiux.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-2">{s.uiux.intro}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-primary text-sm font-medium">
                  <span>Bekijk progressie</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </button>

          </motion.div>
        </div>
      </section>

      <BackToTop />
    </div>
  );
}

export default function Semester4Page() {
  return (
    <LanguageProvider>
      <Semester4Content />
    </LanguageProvider>
  );
}
