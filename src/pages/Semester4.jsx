import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar, Cpu, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "../components/portfolio/Navbar";
import { LanguageProvider } from "../lib/LanguageContext";

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

const TEAM_ROLES = [
  { role: "AI Engineer", name: "Jij", highlight: true },
  { role: "AI Engineer", name: "Teamlid 2" },
  { role: "AI Engineer", name: "Teamlid 3" },
  { role: "AI Engineer", name: "Teamlid 4" },
  { role: "AI Engineer", name: "Teamlid 5" },
];

const MILESTONES = [
  { label: "Concept & onderzoek",       done: true  },
  { label: "Hardware setup",            done: true  },
  { label: "Gezichtsdetectie (OpenCV)", done: true  },
  { label: "Camera tracking mechanisme",done: false },
  { label: "Dark Tech installatie",     done: false },
  { label: "Eindpresentatie",           done: false },
];

export default function Semester4Page() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />

          {/* Hero */}
          <section className="relative min-h-[55vh] flex items-end pb-16 px-6 overflow-hidden pt-28">
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_STYLE} />

            {/* Glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(var(--primary)/0.18) 0%, transparent 70%)",
              }}
            />

            <div className="relative max-w-6xl mx-auto w-full">
              {/* Back */}
              <motion.div {...fadeUp(0)}>
                <Link
                  to="/#projects"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Terug naar projecten
                </Link>
              </motion.div>

              <motion.div {...fadeUp(0.08)} className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1">
                  Semester 4 · 2026
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-md px-2 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  In uitvoering
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

              <motion.p
                {...fadeUp(0.2)}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                Een AI-gestuurde camera die gezichten detecteert en volgt — en daarmee het
                ongemakkelijke gevoel creëert altijd in de gaten gehouden te worden.
                Gebouwd in een team van 5 onder het thema{" "}
                <span className="text-primary font-medium">Dark Tech</span>.
              </motion.p>
            </div>
          </section>

          {/* Main content */}
          <section className="px-6 pb-32">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left — big content column */}
              <div className="lg:col-span-2 space-y-8">

                {/* Placeholder visual */}
                <motion.div {...fadeUp(0.05)}>
                  <div
                    className="w-full rounded-xl overflow-hidden border border-border"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--primary)/0.08) 0%, hsl(var(--primary)/0.18) 50%, hsl(var(--primary)/0.06) 100%)",
                      minHeight: "320px",
                    }}
                  >
                    <div className="relative w-full h-full min-h-[320px] flex flex-col items-center justify-center gap-4">
                      <div className="absolute inset-0 opacity-[0.07]" style={GRID_STYLE} />
                      <div
                        className="absolute inset-0 opacity-40"
                        style={{
                          background:
                            "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--primary)/0.3) 0%, transparent 70%)",
                          animation: "pulse 3s ease-in-out infinite",
                        }}
                      />
                      <div className="relative flex flex-col items-center gap-3 select-none">
                        <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center">
                          <Eye className="w-7 h-7 text-primary/70" />
                        </div>
                        <span className="font-mono text-sm text-primary/60 tracking-widest uppercase">
                          In progress — foto volgt
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Over het project */}
                <motion.div
                  {...fadeUp(0.1)}
                  className="rounded-xl border border-border bg-card p-8 space-y-4"
                >
                  <h2 className="text-xl font-bold">Over het project</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In het Studio Semester van de HvA werken we in een team van 5 aan een
                    project onder het profiel <strong className="text-foreground">AI Engineer</strong>.
                    Het thema dit semester is <strong className="text-foreground">Dark Tech</strong> —
                    technologie die een duistere of ongemakkelijke kant laat zien.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Ons project: een camera die realtime gezichten detecteert met behulp van
                    OpenCV en een servo-mechanisme aanstuurt om het gezicht te volgen. Het
                    resultaat is een installatie die letterlijk naar je kijkt zodra je in beeld
                    komt — en dat gevoel van bewaakt worden tastbaar maakt.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    De hardware draait op een <strong className="text-foreground">Raspberry Pi</strong>,
                    de gezichtsdetectie is gebouwd in Python met OpenCV, en de camera beweegt
                    via een pan-tilt servo systeem.
                  </p>
                </motion.div>

                {/* Voortgang */}
                <motion.div
                  {...fadeUp(0.15)}
                  className="rounded-xl border border-border bg-card p-8 space-y-5"
                >
                  <h2 className="text-xl font-bold">Voortgang</h2>
                  <div className="space-y-3">
                    {MILESTONES.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            m.done
                              ? "border-primary bg-primary"
                              : "border-border bg-background"
                          }`}
                        >
                          {m.done && (
                            <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            m.done ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {m.label}
                        </span>
                        {!m.done && (
                          <span className="font-mono text-xs text-muted-foreground/50 ml-auto">
                            binnenkort
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span className="font-mono">Voortgang</span>
                      <span className="font-mono">
                        {MILESTONES.filter((m) => m.done).length}/{MILESTONES.length}
                      </span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (MILESTONES.filter((m) => m.done).length / MILESTONES.length) * 100
                          }%`,
                        }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right — sidebar */}
              <div className="space-y-6">

                {/* Tech stack */}
                <motion.div
                  {...fadeUp(0.1)}
                  className="rounded-xl border border-border bg-card p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Tech stack</h3>
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
                </motion.div>

                {/* Team */}
                <motion.div
                  {...fadeUp(0.15)}
                  className="rounded-xl border border-border bg-card p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Team van 5</h3>
                  </div>
                  <div className="space-y-2">
                    {TEAM_ROLES.map((m, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${
                          m.highlight
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/30"
                        }`}
                      >
                        <span className={m.highlight ? "text-primary font-medium" : "text-muted-foreground"}>
                          {m.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{m.role}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Semester info */}
                <motion.div
                  {...fadeUp(0.2)}
                  className="rounded-xl border border-border bg-card p-6 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Semester info</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      ["Opleiding",  "Business IT & Management"],
                      ["Instelling", "Hogeschool van Amsterdam"],
                      ["Periode",    "Semester 4 · 2026"],
                      ["Profiel",    "AI Engineer"],
                      ["Thema",      "Dark Tech"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-muted-foreground flex-shrink-0">{label}</span>
                        <span className="text-foreground text-right font-medium text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
