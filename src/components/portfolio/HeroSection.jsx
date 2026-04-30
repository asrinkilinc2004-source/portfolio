import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Linkedin, Mail, Download } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import MagneticButton from "./MagneticButton";

const AVATAR_URL = "/avatar.jpeg";
const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// Three organic scribble loops around the photo (viewBox 300x300, center 150,150)
const SCRIBBLE_PATHS = [
  // Outer wobbly orbit
  "M 148,18 C 175,8 210,14 235,32 C 260,50 272,80 270,112 C 268,144 255,175 238,197 C 221,219 196,235 168,244 C 140,253 108,250 82,236 C 56,222 37,196 30,166 C 23,136 30,100 48,74 C 66,48 98,26 130,18 C 138,16 143,20 148,18",
  // Second crossing loop — starts from bottom-left
  "M 55,215 C 35,192 24,160 28,130 C 32,100 48,72 72,54 C 96,36 128,28 158,32 C 188,36 216,52 232,76 C 248,100 252,132 244,160 C 236,188 218,212 194,226 C 170,240 140,244 112,238 C 88,232 65,228 55,215",
  // Inner tighter loop with slight irregularity
  "M 150,42 C 178,36 208,50 224,74 C 240,98 240,130 228,156 C 216,182 192,200 164,206 C 136,212 104,202 86,182 C 68,162 64,130 74,104 C 84,78 108,58 136,48 C 142,46 148,44 150,42",
];

const START_DELAY = isMobile ? 350 : 850;

function useTypingLoop(text, ready, typeSpeed = 55, deleteSpeed = 25, pauseMs = 10000) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("idle");

  // Only start when splash is done
  useEffect(() => {
    if (!ready) return;
    setDisplayed("");
    setPhase("idle");
    const timer = setTimeout(() => setPhase("typing"), START_DELAY);
    return () => clearTimeout(timer);
  }, [text, ready]);

  useEffect(() => {
    if (phase === "idle") return;
    let timeout;
    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), pauseMs);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed);
      } else {
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, text]);

  return { displayed, showCursor: phase === "typing" && displayed.length < text.length };
}

export default function HeroSection({ splashReady = true }) {
  const { t } = useLanguage();
  const { displayed, showCursor } = useTypingLoop(t.hero.subtitle, splashReady);
  const [photoHovered, setPhotoHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden px-6">

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.3 : 0.7 }}>
            <h1 className="text-5xl md:text-7xl font-inter font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">Asrin Kilinc</span>
              <br />
              <span className="text-primary text-3xl">
                {displayed}
                {showCursor && (
                  <span className="inline-block w-0.5 h-7 bg-primary ml-0.5 align-middle animate-pulse" />
                )}
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0.1 : 0.3 }}
            className="flex items-center gap-4 mt-8 justify-center lg:justify-start flex-wrap">
            <MagneticButton>
              <a href="#contact" className="inline-block bg-[hsl(var(--ring))] text-primary-foreground px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                {t.hero.cta_contact}
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#projects" className="inline-block bg-[hsl(var(--input))] text-foreground px-6 py-3 text-sm font-medium rounded-lg border border-border hover:border-primary/50 transition-colors">
                {t.hero.cta_projects}
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="/cv.pdf" download className="inline-flex items-center gap-2 bg-[hsl(var(--input))] text-foreground px-6 py-3 text-sm font-medium rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Download className="w-4 h-4" />
                {t.hero.cta_cv}
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0.15 : 0.5 }}
            className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
            {[
              { icon: Linkedin, href: "https://www.linkedin.com/in/asrin-k/" },
              { icon: Mail,     href: "#contact" },
            ].map(({ icon: Icon, href }, i) => (
              <MagneticButton key={i}>
                <a href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              </MagneticButton>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.3 : 0.8, delay: isMobile ? 0.1 : 0.2 }}
          className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setPhotoHovered(true)}
            onHoverEnd={() => setPhotoHovered(false)}
            transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
            className="relative cursor-pointer p-6">

            {/* Hand-drawn scribble behind the photo */}
            <svg
              className="absolute pointer-events-none"
              style={{ width: "135%", height: "135%", top: "-17.5%", left: "-17.5%", overflow: "visible", zIndex: 0 }}
              viewBox="0 0 300 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              {SCRIBBLE_PATHS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="hsl(var(--primary))"
                  strokeWidth={i === 0 ? 2 : 1.6}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: photoHovered ? 1 : 0,
                    opacity: photoHovered ? 1 : 0,
                  }}
                  transition={{
                    pathLength: { duration: 0.45, delay: photoHovered ? i * 0.18 : 0, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0, delay: photoHovered ? i * 0.18 : 0 },
                  }}
                />
              ))}
            </svg>

            <div className="relative z-10 w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
              <img src={AVATAR_URL} alt="Profile" className="w-full h-full object-cover object-top" />
            </div>
            <div className="rounded-full absolute inset-0 border border-primary/10 animate-pulse" style={{ zIndex: 10 }} />
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.4 : 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
