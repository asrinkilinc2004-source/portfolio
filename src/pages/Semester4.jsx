import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "../components/portfolio/Navbar";
import CustomCursor from "../components/portfolio/CustomCursor";
import ScrollProgressBar from "../components/portfolio/ScrollProgressBar";
import BackToTop from "../components/portfolio/BackToTop";
import { LanguageProvider, useLanguage } from "../lib/LanguageContext";
import { useLenis } from "../lib/useLenis";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
  backgroundSize: "60px 60px",
};

const TAGS = ["AI", "Python", "Computer Vision", "Dark Tech", "Raspberry Pi", "OpenCV"];

const TEAM = [
  { name: "Asrin Kilinc",       role: "AI Engineer",              highlight: true },
  { name: "Ramzi Chejjar",      role: "AI Engineer" },
  { name: "Afnaan Makhloufi",   role: "AI Engineer" },
  { name: "Randy Maigua Lema",  role: "Creative Technologist" },
  { name: "Chahid Aouriaghel",  role: "Digital Business Engineer" },
];

const MILESTONE_DONE = [true, true, true, true, false, false];

// Tilt card wrapper — same as ProjectsSection
function TiltCard({ children, className = "" }) {
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
    <div
      ref={ref}
      onMouseMove={isMobile ? undefined : onMove}
      onMouseLeave={isMobile ? undefined : onLeave}
      className={`rounded-xl border border-border bg-card hover:border-primary/30 transition-colors duration-300 ${className}`}
      style={{ willChange: "transform" }}
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

  const patternRef  = useRef(null);
  const pattern2Ref = useRef(null);

  // Always start at top when navigating to this page
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Same parallax scroll handler as Home.jsx
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH   = window.innerHeight;
        const progress = Math.min(Math.max((scrollY - heroH * 0.4) / (heroH * 0.4), 0), 1);
        const isDark  = document.documentElement.classList.contains("dark");

        if (patternRef.current) {
          patternRef.current.style.opacity   = (progress * (isDark ? 0.08 : 0.20)).toString();
          patternRef.current.style.transform = `translate3d(0,${-scrollY * 0.35}px,0)`;
        }
        if (pattern2Ref.current) {
          pattern2Ref.current.style.opacity   = (progress * (isDark ? 0.18 : 0.35)).toString();
          pattern2Ref.current.style.transform = `translate3d(0,${-scrollY * 0.6}px,0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Parallax pattern layers (identical to Home) ── */}
      <div ref={patternRef} aria-hidden="true" className="fixed pointer-events-none"
        style={{
          zIndex: 10, opacity: 0,
          top: "-200vh", left: "-10%", width: "120%", height: "900vh",
          willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div ref={pattern2Ref} aria-hidden="true" className="fixed pointer-events-none"
        style={{
          zIndex: 11, opacity: 0,
          top: "-200vh", left: "-10%", width: "120%", height: "900vh",
          willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground)) 1.5px, transparent 1.5px)",
          backgroundSize: "95px 95px",
        }}
      />

      <CustomCursor />
      <Navbar />
      <ScrollProgressBar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end pb-16 px-6 overflow-hidden pt-28">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_STYLE} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(var(--primary)/0.18) 0%, transparent 70%)",
          }}
        />

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
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-md px-2 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {s.in_progress}
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
      <section className="relative px-6 pb-32" style={{ zIndex: 12 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Project photos */}
            <div className="grid grid-cols-2 gap-4">
              {["/webcam1.jpeg", "/webcam2.jpeg"].map((src, i) => (
                <motion.div key={i} {...fadeUp(0.05 + i * 0.07)}>
                  <TiltCard className="overflow-hidden">
                    <img
                      src={src}
                      alt={`AI Face Tracking Camera ${i + 1}`}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            {/* Over het project */}
            <motion.div {...fadeUp(0.1)}>
              <TiltCard className="p-8 space-y-4">
                <h2 className="text-xl font-bold">{s.about_title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.about_p1}</p>
                <p className="text-muted-foreground leading-relaxed">{s.about_p2}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {s.about_p3.split("Raspberry Pi").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <React.Fragment key={i}>
                        {part}<strong className="text-foreground">Raspberry Pi</strong>
                      </React.Fragment>
                    ) : part
                  )}
                </p>
              </TiltCard>
            </motion.div>

            {/* Voortgang */}
            <motion.div {...fadeUp(0.15)}>
              <TiltCard className="p-8 space-y-5">
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
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(doneCount / milestones.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Tech stack */}
            <motion.div {...fadeUp(0.1)}>
              <TiltCard className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">{s.tech_title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>

            {/* Team */}
            <motion.div {...fadeUp(0.15)}>
              <TiltCard className="p-6 space-y-4">
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
                          : "bg-muted/30 hover:bg-muted/50"
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
              </TiltCard>
            </motion.div>

            {/* Semester info */}
            <motion.div {...fadeUp(0.2)}>
              <TiltCard className="p-6 space-y-3">
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
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── UI/UX Rapport ────────────────────────────────── */}
      <section className="relative px-6 pb-32" style={{ zIndex: 12 }}>
        <div className="max-w-6xl mx-auto space-y-14">

          {/* Header */}
          <motion.div {...fadeUp(0)}>
            <span className="font-mono text-sm text-primary tracking-wider">{s.uiux.label}</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">{s.uiux.title}</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{s.uiux.intro}</p>
          </motion.div>

          {/* ── 1. Gebruikerstesten ── */}
          <motion.div {...fadeUp(0.05)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.tests_title}</h3>
              <p  className="text-muted-foreground leading-relaxed">{s.uiux.tests_intro}</p>

              {/* img 1 — v1 interface */}
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/1.png" alt={s.uiux.img1_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img1_caption}</figcaption>
              </figure>

              {/* img 2 — testresultaten tabel */}
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/2.jpg" alt={s.uiux.img2_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img2_caption}</figcaption>
              </figure>

              {/* Findings */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">{s.uiux.findings_title}</h4>
                <ul className="space-y-2">
                  {s.uiux.findings.map((f, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm leading-relaxed">
                      <span className="text-primary font-mono mt-0.5 flex-shrink-0">—</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rename */}
              <div className="pt-2 border-t border-border">
                <h4 className="font-semibold text-foreground mb-2">{s.uiux.rename_title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.uiux.rename_text}</p>
              </div>
            </TiltCard>
          </motion.div>

          {/* ── 2. UI Design ── */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.design_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.design_intro}</p>

              {/* img 3 + 4 — Figma v2 & live UI v2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <figure className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-border h-56 md:h-64">
                    <img src="/3.jpg" alt={s.uiux.img3_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img3_caption}</figcaption>
                </figure>
                <figure className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-border h-56 md:h-64">
                    <img src="/4.png" alt={s.uiux.img4_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img4_caption}</figcaption>
                </figure>
              </div>

              {/* Design choices */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">{s.uiux.choices_title}</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {s.uiux.choices.map((c, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">◆</span>
                      <div>
                        <span className="text-sm font-semibold text-foreground">{c.label}</span>
                        <span className="text-muted-foreground text-sm"> — {c.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* v1 → v2 changes */}
              <div className="pt-2 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">{s.uiux.changes_title}</h4>
                <ul className="space-y-1.5">
                  {s.uiux.changes.map((c, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                      <span className="text-primary font-mono flex-shrink-0">–</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </motion.div>

          {/* ── Versie 3 ── */}
          <motion.div {...fadeUp(0.1)}>
            <TiltCard className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{s.uiux.v3_title}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-mono">{s.uiux.v3_subtitle}</p>
              </div>

              {/* img 5 — Figma v3 */}
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/5.png" alt={s.uiux.img5_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img5_caption}</figcaption>
              </figure>

              {/* img 6 — Tracker v3 live */}
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/6.png" alt={s.uiux.img6_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img6_caption}</figcaption>
              </figure>
              <p className="text-xs text-muted-foreground italic text-center px-4">{s.uiux.img6_note}</p>
            </TiltCard>
          </motion.div>

          {/* ── Gebruikerstesten ronde 2 ── */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.tests2_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.tests2_text}</p>

              {/* img 7 — testresultaten ronde 2 */}
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/7.png" alt={s.uiux.img7_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img7_caption}</figcaption>
              </figure>
            </TiltCard>
          </motion.div>

          {/* ── Final versie ── */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.final_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.final_text}</p>

              {/* img 8 — final version */}
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/8.png" alt={s.uiux.img8_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img8_caption}</figcaption>
              </figure>

              {/* img 9 — snapshots */}
              <p className="text-muted-foreground text-sm leading-relaxed">{s.uiux.snapshot_text}</p>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src="/9.png" alt={s.uiux.img9_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img9_caption}</figcaption>
              </figure>
            </TiltCard>
          </motion.div>

          {/* ── Verbeterpunten ── */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.improvements_title}</h3>
              <div className="space-y-3">
                {s.uiux.improvements.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border">
                    <span className="font-mono text-primary font-bold flex-shrink-0 text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.title}</p>
                      <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </motion.div>

          {/* ── Afsluiting ── */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.conclusion_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.conclusion}</p>
            </TiltCard>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           AI VISITOR TRACKING SYSTEM SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Section header */}
          <motion.div {...fadeUp(0)} className="mb-4">
            <span className="font-mono text-sm text-primary tracking-wider">{s.ai.label}</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">{s.ai.title}</h2>
            <p className="text-xs text-muted-foreground font-mono mt-2 tracking-wider">{s.ai.authors}</p>
          </motion.div>

          {/* 1 — Inleiding */}
          <motion.div {...fadeUp(0.05)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.ai.intro_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.intro}</p>
            </TiltCard>
          </motion.div>

          {/* 2 — Back-end */}
          <motion.div {...fadeUp(0.07)}>
            <TiltCard className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-foreground">{s.ai.backend_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.backend_text}</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {s.ai.backend_libs.map((lib, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border space-y-1">
                    <p className="font-semibold text-primary font-mono text-sm">{lib.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{lib.desc}</p>
                  </div>
                ))}
              </div>
            </TiltCard>
          </motion.div>

          {/* 3 — Visitor Counter */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-foreground">{s.ai.counter_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.counter_text}</p>

              {/* Code block */}
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="font-mono text-xs text-muted-foreground ml-2">visitor_tracker.py</span>
                </div>
                <pre className="p-5 bg-black/80 text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{s.ai.code_snippet}</code>
                </pre>
              </div>

              {/* Storage table */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">{s.ai.storage_title}</h4>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="text-left px-4 py-3 font-mono text-xs text-primary font-semibold">Path</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-primary font-semibold">Inhoud</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.ai.storage_rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-muted/10" : ""}>
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{row.path}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* 4 — Threading */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.ai.threading_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.threading_text}</p>
            </TiltCard>
          </motion.div>

          {/* 5 — Front-end */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.ai.frontend_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.frontend_text}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["HTML/CSS", "JavaScript", "MJPEG Stream", "fetchData()", "fetchVisitors()"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">{tag}</span>
                ))}
              </div>
            </TiltCard>
          </motion.div>

          {/* 6 — Technische verdieping */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.ai.tech_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.tech_text}</p>
            </TiltCard>
          </motion.div>

          {/* 7 — Conclusie */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.ai.conclusion_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.ai.conclusion}</p>
            </TiltCard>
          </motion.div>

        </div>
      </section>

      <BackToTop />
    </div>
  );
}

export default function Semester4Page() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <Semester4Content />
      </LanguageProvider>
    </ThemeProvider>
  );
}
