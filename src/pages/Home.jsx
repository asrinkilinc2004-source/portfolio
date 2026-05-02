import React, { useState, useEffect, useRef } from "react";
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
  const patternRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!patternRef.current) return;
      const heroH = window.innerHeight;
      const t = Math.min(Math.max((window.scrollY - heroH * 0.4) / (heroH * 0.4), 0), 1);
      patternRef.current.style.opacity = (t * 0.055).toString();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LanguageProvider>
      {/* Fixed parallax background pattern — fades in after hero, never scrolls */}
      <div
        ref={patternRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: 0 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bg-pattern" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="hsl(var(--primary))" />
              <circle cx="14" cy="14" r="0.6" fill="hsl(var(--primary))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-pattern)" />
        </svg>
      </div>

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
