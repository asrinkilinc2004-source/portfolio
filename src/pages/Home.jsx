import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { useLenis } from "../lib/useLenis";
import Navbar from "../components/portfolio/Navbar";
import HeroSection from "../components/portfolio/HeroSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import EducationSection from "../components/portfolio/EducationSection";
import TechNewsSection from "../components/portfolio/TechNewsSection";
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
  const [skipSplash] = useState(() => !!location.state?.scrollTo || sessionStorage.getItem("splashShown") === "true");

  // "POP" = browser back/forward in React Router (reliable for SPA navigation)
  const isBackNav = useNavigationType() === "POP";

  // On back nav: start hidden so scroll can be restored before content appears
  const [splashDone, setSplashDone] = useState(skipSplash && !isBackNav);
  const finishSplash = useCallback(() => setSplashDone(true), []);

  // Remember splash was shown so it won't replay this session
  useEffect(() => { sessionStorage.setItem("splashShown", "true"); }, []);

  // Restore scroll before first paint — no flash at Y=0
  useLayoutEffect(() => {
    if (!isBackNav || !skipSplash) return;
    const savedY = parseInt(sessionStorage.getItem("portfolioScrollY") || "0");
    if (!savedY) { setSplashDone(true); return; }
    window.scrollTo(0, savedY);
    // After Lenis inits, also tell it the correct position, then reveal content
    const t = setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(savedY, { immediate: true });
      setSplashDone(true);
    }, 80);
    return () => clearTimeout(t);
  }, []);

  // Save scroll position — debounced during scroll, immediately on unmount
  useEffect(() => {
    let timer;
    const save = () => {
      clearTimeout(timer);
      timer = setTimeout(() => sessionStorage.setItem("portfolioScrollY", window.scrollY), 150);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      window.removeEventListener("scroll", save);
      clearTimeout(timer);
      // Always save on unmount (catches navigating away before debounce fires)
      sessionStorage.setItem("portfolioScrollY", window.scrollY);
    };
  }, []);

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
    let frame = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (patternRef.current) {
          patternRef.current.style.transform = `translate3d(0,${-(scrollY * 0.35 % 28)}px,0)`;
        }
        if (pattern2Ref.current) {
          pattern2Ref.current.style.transform = `translate3d(0,${-(scrollY * 0.6 % 95)}px,0)`;
        }
        frame = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <LanguageProvider>
      {/* Layer 1 — background, dense dots, 35% scroll speed */}
      <div ref={patternRef} aria-hidden="true" className="fixed pointer-events-none opacity-20 dark:opacity-[0.08]"
        style={{
          zIndex: 10,
          top: 0, left: 0, width: "100%", height: "calc(100% + 28px)",
          willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Layer 2 — middle, sparse dots, muted color, 60% scroll speed */}
      <div ref={pattern2Ref} aria-hidden="true" className="fixed pointer-events-none opacity-[0.35] dark:opacity-[0.18]"
        style={{
          zIndex: 11,
          top: 0, left: 0, width: "100%", height: "calc(100% + 95px)",
          willChange: "transform",
          backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground)) 1.5px, transparent 1.5px)",
          backgroundSize: "95px 95px",
        }}
      />

      {!skipSplash && <SplashIntro onDone={finishSplash} />}
      {/* Keep navigation available during the opening moment. */}
      <CustomCursor />
      <Navbar />
      <ScrollProgressBar />
      <div
        className="min-h-screen bg-background text-foreground"
        style={{
          visibility: splashDone ? "visible" : "hidden",
          pointerEvents: splashDone ? "auto" : "none",
        }}
      >
        <HeroSection splashReady={splashDone} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection />
        <TechNewsSection />
        <Footer />
        <BackToTop />
      </div>
    </LanguageProvider>
  );
}
