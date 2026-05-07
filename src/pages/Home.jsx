import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  // Skip splash when returning from a subpage (e.g. Semester4)
  const skipSplash = !!location.state?.scrollTo || sessionStorage.getItem("splashShown") === "true";
  const [splashDone, setSplashDone] = useState(skipSplash);

  // Remember splash was shown so it won't replay this session
  useEffect(() => { sessionStorage.setItem("splashShown", "true"); }, []);

  // Scroll to target element when navigating back
  useEffect(() => {
    if (!location.state?.scrollTo) return;
    const id = location.state.scrollTo;
    const attempt = (tries = 0) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      } else if (tries < 8) {
        setTimeout(() => attempt(tries + 1), 80);
      }
    };
    setTimeout(() => attempt(), 120);
  }, [location.state]);

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
          backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground)) 1.5px, transparent 1.5px)",
          backgroundSize: "95px 95px",
        }}
      />

      {!skipSplash && <SplashIntro onDone={() => setSplashDone(true)} />}
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
