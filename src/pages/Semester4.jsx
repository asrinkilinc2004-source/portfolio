import React, { useRef, useEffect, useState, useCallback } from "react";
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
const WebcamScene3D = React.lazy(() => import("../components/portfolio/WebcamScene3D"));

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
function TiltCard({ children, className = "", onClick }) {
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
      onClick={onClick}
      className={`rounded-xl border border-border bg-card hover:border-primary/30 transition-colors duration-300 ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

function Lightbox({ src, alt, onClose }) {
  const [scale, setScale]   = useState(1);
  const [pos,   setPos]     = useState({ x: 0, y: 0 });
  const overlayRef          = useRef(null);
  const drag                = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false });
  const pinchDist           = useRef(null);

  // Reset zoom + pan whenever a new image opens
  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [src]);

  // ESC to close
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  // Non-passive wheel → zoom without zooming the page
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !src) return;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setScale(s => Math.min(Math.max(s * factor, 1), 6));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [src]);

  // ── Mouse drag (pan when zoomed) ───────────────────────────────────
  const onMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    drag.current = { active: true, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    setPos({ x: drag.current.ox + dx, y: drag.current.oy + dy });
  };
  const onMouseUp = () => { drag.current.active = false; };

  // Double-click resets zoom
  const onDblClick = (e) => {
    e.stopPropagation();
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  // ── Touch pinch-zoom (prevents browser pinch-zoom on page) ────────
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length !== 2 || !pinchDist.current) return;
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const factor = dist / pinchDist.current;
    setScale(s => Math.min(Math.max(s * factor, 1), 6));
    pinchDist.current = dist;
  };
  const onTouchEnd = () => { pinchDist.current = null; };

  // Close only when clicking the backdrop (not when dragging)
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current && !drag.current.moved) onClose();
    drag.current.moved = false;
  };

  const cursorClass = scale > 1
    ? (drag.current.active ? "cursor-grabbing" : "cursor-grab")
    : "cursor-zoom-in";

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onBackdropClick}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", touchAction: "none" }}
        >
          <motion.div
            className="relative max-w-5xl w-full px-4 md:px-12 select-none"
            initial={{ scale: 0.86, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.90, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={onMouseDown}
              onDoubleClick={onDblClick}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className={`w-full max-h-[85vh] object-contain rounded-xl shadow-2xl ${cursorClass}`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: drag.current.active ? "none" : "transform 0.12s ease",
                userSelect: "none",
              }}
            />
            {alt && (
              <p className="text-center text-xs text-white/60 font-mono italic mt-3"
                style={{ transform: `translateY(${pos.y > 0 ? pos.y * 0.1 : 0}px)` }}>
                {alt}
              </p>
            )}
          </motion.div>

          {/* Close + zoom hint */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="text-white/30 font-mono text-xs">scroll = zoom · dubbelklik = reset</span>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 transition-colors font-mono text-xs"
            >
              ✕ sluiten
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Semester4Content() {
  useLenis();
  const navigate = useNavigate();

  const { t } = useLanguage();
  const s = t.semester4;

  const [lightbox, setLightbox] = useState(null); // { src, alt }
  const openImg = useCallback((src, alt) => setLightbox({ src, alt }), []);

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
      <Lightbox src={lightbox?.src} alt={lightbox?.alt} onClose={() => setLightbox(null)} />

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

        {/* ── 3D Wireframe Webcam ── */}
        <React.Suspense fallback={null}>
          <div
            className="absolute pointer-events-none select-none hidden md:block"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-5%, -50%)",
              width: "min(50%, 540px)",
              height: "min(80vh, 440px)",
              opacity: 0.88,
              zIndex: 1,
              maskImage: "radial-gradient(ellipse 75% 80% at 50% 50%, black 35%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 80% at 50% 50%, black 35%, transparent 100%)",
            }}
          >
            <WebcamScene3D />
          </div>
        </React.Suspense>

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
                  <TiltCard className="overflow-hidden cursor-zoom-in" onClick={() => openImg(src, `AI Face Tracking Camera ${i + 1}`)}>
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

      {/* ── Navigatiekaarten ─────────────────────────────── */}
      <section className="relative px-6 pb-32" style={{ zIndex: 12 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* AI Systeem */}
            <button
              onClick={() => navigate("/semester4/ai")}
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden text-left"
              style={{ willChange: "transform" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary)/0.10) 0%, transparent 70%)" }} />
              <div className="relative p-10 flex flex-col gap-5 h-full min-h-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1 1 .03 2.698-1.338 2.698H4.136c-1.368 0-2.338-1.698-1.338-2.698L4 15.301" />
                    </svg>
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
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden text-left"
              style={{ willChange: "transform" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary)/0.10) 0%, transparent 70%)" }} />
              <div className="relative p-10 flex flex-col gap-5 h-full min-h-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <Semester4Content />
      </LanguageProvider>
    </ThemeProvider>
  );
}
