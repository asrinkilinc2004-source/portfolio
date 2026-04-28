import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import MagneticButton from "./MagneticButton";

const AVATAR_URL = "/avatar.jpeg";
const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const START_DELAY = isMobile ? 350 : 850;

function useTypingLoop(text, typeSpeed = 55, deleteSpeed = 25, pauseMs = 10000) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    setDisplayed("");
    setPhase("idle");
    const timer = setTimeout(() => setPhase("typing"), START_DELAY);
    return () => clearTimeout(timer);
  }, [text]);

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

export default function HeroSection() {
  const { t } = useLanguage();
  const { displayed, showCursor } = useTypingLoop(t.hero.subtitle);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">

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
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
              <img src={AVATAR_URL} alt="Profile" className="w-full h-full object-cover scale-125 object-top" />
            </div>
            <div className="px-5 rounded-full absolute -inset-4 border border-primary/10 animate-pulse" />
          </div>
        </motion.div>
      </div>

      <motion.a href="#about"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.4 : 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
