import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
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

function Semester4AIContent() {
  useLenis();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const s = t.semester4;

  const patternRef  = useRef(null);
  const pattern2Ref = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div ref={patternRef} aria-hidden="true" className="fixed pointer-events-none"
        style={{ zIndex: 10, opacity: 0, top: "-200vh", left: "-10%", width: "120%", height: "900vh", willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div ref={pattern2Ref} aria-hidden="true" className="fixed pointer-events-none"
        style={{ zIndex: 11, opacity: 0, top: "-200vh", left: "-10%", width: "120%", height: "900vh", willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground)) 1.5px, transparent 1.5px)", backgroundSize: "95px 95px" }} />
      <CustomCursor />
      <Navbar />
      <ScrollProgressBar />

      {/* Hero */}
      <section className="relative min-h-[32vh] flex items-end pb-14 px-6 pt-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_STYLE} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(var(--primary)/0.15) 0%, transparent 70%)" }} />
        <div className="relative max-w-4xl mx-auto w-full">
          <motion.div {...fadeUp(0)}>
            <button onClick={() => navigate("/semester4")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Terug naar Semester 4
            </button>
          </motion.div>
          <motion.div {...fadeUp(0.06)} className="flex flex-wrap gap-2 mb-4">
            <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1">{s.ai.label}</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {s.ai.title}
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-xs text-muted-foreground font-mono mt-3">{s.ai.authors}</motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">

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

export default function Semester4AIPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <Semester4AIContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
