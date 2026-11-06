import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-border bg-card hover:border-primary/40 transition-colors duration-300 ${className}`}>
      {children}
    </div>
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
    <div className="min-h-screen bg-background text-foreground lg:pl-64">
      <Lightbox src={lightbox?.src} alt={lightbox?.alt} onClose={() => setLightbox(null)} />
      <Navbar />
      <ScrollProgressBar />

      {/* Hero */}
      <section className="relative min-h-[32vh] flex items-end pb-14 px-6 pt-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_STYLE} />
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
            <Card className="p-8 space-y-6">
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
            </Card>
          </motion.div>

          {/* 2. UI Design */}
          <motion.div {...fadeUp(0.08)}>
            <Card className="p-8 space-y-6">
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
            </Card>
          </motion.div>

          {/* Versie 3 */}
          <motion.div {...fadeUp(0.1)}>
            <Card className="p-8 space-y-6">
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
            </Card>
          </motion.div>

          {/* Gebruikerstesten ronde 2 */}
          <motion.div {...fadeUp(0.08)}>
            <Card className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.tests2_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.tests2_text}</p>
              <figure className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-border cursor-zoom-in" onClick={() => openImg("/7.png", s.uiux.img7_caption)}>
                  <img src="/7.png" alt={s.uiux.img7_caption} draggable={false} onContextMenu={e => e.preventDefault()} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <figcaption className="text-center text-xs text-muted-foreground font-mono italic">{s.uiux.img7_caption}</figcaption>
              </figure>
            </Card>
          </motion.div>

          {/* Final versie */}
          <motion.div {...fadeUp(0.08)}>
            <Card className="p-8 space-y-6">
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
            </Card>
          </motion.div>

          {/* Verbeterpunten */}
          <motion.div {...fadeUp(0.08)}>
            <Card className="p-8 space-y-5">
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
            </Card>
          </motion.div>

          {/* Afsluiting */}
          <motion.div {...fadeUp(0.08)}>
            <Card className="p-8 space-y-3">
              <h3 className="text-xl font-bold text-foreground">{s.uiux.conclusion_title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.uiux.conclusion}</p>
            </Card>
          </motion.div>

        </div>
      </section>

      <BackToTop />
    </div>
  );
}

export default function Semester4UiuxPage() {
  return (
    <LanguageProvider>
      <Semester4UiuxContent />
    </LanguageProvider>
  );
}
