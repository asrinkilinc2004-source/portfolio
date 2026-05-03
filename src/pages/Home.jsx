import React, { useState, useEffect, useRef } from "react";

const X_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="95" height="95"><line x1="42" y1="42" x2="53" y2="53" stroke="#888" stroke-width="1.6" stroke-linecap="round"/><line x1="53" y1="42" x2="42" y2="53" stroke="#888" stroke-width="1.6" stroke-linecap="round"/></svg>`
);
const X_PATTERN = `url("data:image/svg+xml,${X_SVG}")`;
import { useLenis } from "../lib/useLenis";
import Navbar from "../components/portfolio/Navbar";
import HeroSection from "../components/portfolio/HeroSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import EducationSection from "../components/portfolio/EducationSection";
import ContactSection from "../components/portfolio/ContactSection";
import Footer from "../components/portfolio/Footer";
import CustomCursor from "../components/portfolio/CustomCursor";
import BackToTop from "../components/portfolio/BackToTop";
import ScrollProgressBar from "../components/portfolio/ScrollProgressBar";
import SplashIntro from "../components/portfolio/SplashIntro";
import { LanguageProvider } from "../lib/LanguageContext";

export default function Home() {
  useLenis();
  const [splashDone, setSplashDone] = useState(false);
  const patternRef  = useRef(null);
  const pattern2Ref = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH   = window.innerHeight;
        const t       = Math.min(Math.max((scrollY - heroH * 0.4) / (heroH * 0.4), 0), 1);
        const isDark  = document.documentElement.classList.contains("dark");

        if (patternRef.current) {
          patternRef.current.style.opacity   = (t * (isDark ? 0.08 : 0.20)).toString();
          patternRef.current.style.transform = `translate3d(0,${-scrollY * 0.35}px,0)`;
        }
        if (pattern2Ref.current) {
          pattern2Ref.current.style.opacity   = (t * (isDark ? 0.18 : 0.35)).toString();
          pattern2Ref.current.style.transform = `translate3d(0,${-scrollY * 0.6}px,0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LanguageProvider>
      {/* Layer 1 — background, dense dots, 35% scroll speed */}
      <div ref={patternRef} aria-hidden="true" className="fixed pointer-events-none"
        style={{
          zIndex: 10, opacity: 0,
          top: "-200vh", left: "-10%", width: "120%", height: "900vh",
          willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Layer 2 — middle, sparse dots, muted color, 60% scroll speed */}
      <div ref={pattern2Ref} aria-hidden="true" className="fixed pointer-events-none"
        style={{
          zIndex: 11, opacity: 0,
          top: "-200vh", left: "-10%", width: "120%", height: "900vh",
          willChange: "transform",
          backgroundImage: X_PATTERN,
          backgroundSize: "95px 95px",
        }}
      />

      <SplashIntro onDone={() => setSplashDone(true)} />
      {/* These stay visible at all times — outside the fading div */}
      <CustomCursor />
      <Navbar />
      <ScrollProgressBar />
      <div
        className="min-h-screen bg-background text-foreground"
        style={{
          opacity:       splashDone ? 1 : 0,
          transform:     splashDone ? "translateY(0)" : "translateY(12px)",
          transition:    "opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          pointerEvents: splashDone ? "auto" : "none",
        }}
      >
        <HeroSection splashReady={splashDone} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection />
        <Footer />
        <BackToTop />
      </div>
    </LanguageProvider>
  );
}
