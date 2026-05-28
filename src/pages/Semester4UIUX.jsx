import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.05s linear";
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 6}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };
  return (
    <div ref={ref}
      onMouseMove={isMobile ? undefined : onMove}
      onMouseLeave={isMobile ? undefined : onLeave}
      className={`rounded-xl border border-border bg-card hover:border-primary/30 transition-colors duration-300 ${className}`}
      style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }) {
  const [scale, setScale]   = useState(1);
  const [pos,   setPos]     = useState({ x: 0, y: 0 });
  const overlayRef          = useRef(null);
  const drag                = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false });
  const pinchDist           = useRef(null);

  useEffect(() => { setScale(1); setPos({ x: 0, y: 0 }); }, [src]);

  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !src) return;
    const onWheel = (e) => {
      e.preventDefault(); e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setScale(s => Math.min(Math.max(s * factor, 1), 6));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [src]);

  const onMouseDown = (e) => {
    if (scale <= 1) return; e.preventDefault();
    drag.current = { active: true, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.sx, dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    setPos({ x: drag.current.ox + dx, y: drag.current.oy + dy });
  };
  const onMouseUp    = () => { drag.current.active = false; };
  const onDblClick   = (e) => { e.stopPropagation(); setScale(1); setPos({ x: 0, y: 0 }); };
  const onTouchStart = (e) => {
    if (e.touches.length === 2)
      pinchDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  };
  const onTouchMove  = (e) => {
    if (e.touches.length !== 2 || !pinchDist.current) return; e.preventDefault();
    const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    setScale(s => Math.min(Math.max(s * (dist / pinchDist.current), 1), 6));
    pinchDist.current = dist;
  };
  const onTouchEnd   = () => { pinchDist.current = null; };
  const onBackdrop   = (e) => { if (e.target === overlayRef.current && !drag.current.moved) onClose(); drag.current.moved = false; };
  const cursorClass  = scale > 1 ? (drag.current.active ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in";

  return (
    <AnimatePresence>
      {src && (
        <motion.div ref={overlayRef}
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          onClick={onBackdrop} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", touchAction: "none" }}>
          <motion.div className="relative max-w-5xl w-full px-4 md:px-12 select-none"
            initial={{ scale: 0.86, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.90, opacity: 0, y: 10 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}>
            <img src={src} alt={alt} draggable={false} onContextMenu={(e) => e.preventDefault()}
              onMouseDown={onMouseDown} onDoubleClick={onDblClick}
              onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
              className={`w-full max-h-[85vh] object-contain rounded-xl shadow-2xl ${cursorClass}`}
              style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: "center center",
                transition: drag.current.active ? "none" : "transform 0.12s ease", userSelect: "none" }} />
            {alt && <p className="text-center text-xs text-white/60 font-mono italic mt-3">{alt}</p>}
          </motion.div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="text-white/30 font-mono text-xs">scroll = zoom · dubbelklik = reset</span>
            <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors font-mono text-xs">✕ sluiten</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Semester4UiuxContent() {
  useLenis();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const s = t.semester4;

  const [lightbox, setLightbox] = useState(null);
  const openImg = useCallback((src, alt) => setLightbox({ src, alt }), []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Lightbox src={lightbox?.src} alt={lightbox?.alt} onClose={() => setLightbox(null)} />
      <CustomCursor />
      <Navbar />
      <ScrollProgressBar />

      {/* Hero */}
      <section className="relative min-h-[32vh] flex items-end pb-14 px-6 pt-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_STYLE} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(var(--primary)/0.15) 0%, transparent 70%)" }} />
        <div className="relative max-w-6xl mx-auto w-full">
          <motion.div {...fadeUp(0)}>
            <button onClick={() => navigate("/semester4")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Terug naar Semester 4
            </button>
          </motion.div>
          <motion.div {...fadeUp(0.06)} className="flex flex-wrap gap-2 mb-4">
            <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1">{s.uiux.label}</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {s.uiux.title}
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{s.uiux.intro}</motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto space-y-14">

          {/* 1. Gebruikerstesten */}
          <motion.div {...fadeUp(0.05)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.tests_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.tests_intro}</p>
              <figure className="space-y-2 max-w-sm mx-auto">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/1.png", s.uiux.img1_caption)}>
                  <img src="/1.png" alt={s.uiux.img1_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img1_caption}</figcaption>
              </figure>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/2.jpg", s.uiux.img2_caption)}>
                  <img src="/2.jpg" alt={s.uiux.img2_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img2_caption}</figcaption>
              </figure>
              <div>
                <h4 className="font-semibold text-foreground mb-3">{s.uiux.findings_title}</h4>
                <ul className="space-y-2">
                  {s.uiux.findings.map((f, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm leading-relaxed">
                      <span className="text-primary font-mono mt-0.5 flex-shrink-0">—</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-border">
                <h4 className="font-semibold text-foreground mb-2">{s.uiux.rename_title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.uiux.rename_text}</p>
              </div>
            </TiltCard>
          </motion.div>

          {/* 2. UI Design */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.design_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.design_intro}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <figure className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-border h-56 md:h-64 cursor-zoom-in" onClick={() => openImg("/3.jpg", s.uiux.img3_caption)}>
                    <img src="/3.jpg" alt={s.uiux.img3_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img3_caption}</figcaption>
                </figure>
                <figure className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-border h-56 md:h-64 cursor-zoom-in" onClick={() => openImg("/4.png", s.uiux.img4_caption)}>
                    <img src="/4.png" alt={s.uiux.img4_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img4_caption}</figcaption>
                </figure>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">{s.uiux.choices_title}</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {s.uiux.choices.map((c, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">◆</span>
                      <div><span className="text-sm font-semibold text-foreground">{c.label}</span><span className="text-muted-foreground text-sm"> — {c.desc}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">{s.uiux.changes_title}</h4>
                <ul className="space-y-1.5">
                  {s.uiux.changes.map((c, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                      <span className="text-primary font-mono flex-shrink-0">–</span><span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </motion.div>

          {/* Versie 3 */}
          <motion.div {...fadeUp(0.1)}>
            <TiltCard className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{s.uiux.v3_title}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-mono">{s.uiux.v3_subtitle}</p>
              </div>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/5.png", s.uiux.img5_caption)}>
                  <img src="/5.png" alt={s.uiux.img5_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img5_caption}</figcaption>
              </figure>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/6.png", s.uiux.img6_caption)}>
                  <img src="/6.png" alt={s.uiux.img6_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img6_caption}</figcaption>
              </figure>
              <p className="text-xs text-muted-foreground italic text-center px-4">{s.uiux.img6_note}</p>
            </TiltCard>
          </motion.div>

          {/* Gebruikerstesten ronde 2 */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.tests2_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.tests2_text}</p>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/7.png", s.uiux.img7_caption)}>
                  <img src="/7.png" alt={s.uiux.img7_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img7_caption}</figcaption>
              </figure>
            </TiltCard>
          </motion.div>

          {/* Final versie */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.final_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.final_text}</p>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/8.png", s.uiux.img8_caption)}>
                  <img src="/8.png" alt={s.uiux.img8_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img8_caption}</figcaption>
              </figure>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.uiux.snapshot_text}</p>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/9.png", s.uiux.img9_caption)}>
                  <img src="/9.png" alt={s.uiux.img9_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img9_caption}</figcaption>
              </figure>
            </TiltCard>
          </motion.div>

          {/* Verbeterpunten */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.improvements_title}</h3>
              <div className="space-y-3">
                {s.uiux.improvements.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border">
                    <span className="font-mono text-primary font-bold flex-shrink-0 text-sm">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.title}</p>
                      <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </motion.div>

          {/* Afsluiting */}
          <motion.div {...fadeUp(0.08)}>
            <TiltCard className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.conclusion_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.conclusion}</p>
            </TiltCard>
          </motion.div>

        </div>
      </section>

      <BackToTop />
    </div>
  );
}

export default function Semester4UiuxPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <Semester4UiuxContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
