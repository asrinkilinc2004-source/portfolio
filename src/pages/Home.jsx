import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { useLenis } from "../lib/useLenis";
import Navbar from "../components/portfolio/Navbar";
import HeroSection from "../components/portfolio/HeroSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import EducationSection from "../components/portfolio/EducationSection";
import ContactSection from "../components/portfolio/ContactSection";
import Footer from "../components/portfolio/Footer";
import BackToTop from "../components/portfolio/BackToTop";
import ScrollProgressBar from "../components/portfolio/ScrollProgressBar";
import { LanguageProvider } from "../lib/LanguageContext";

export default function Home() {
  useLenis();
  const location = useLocation();
  const isBackNav = useNavigationType() === "POP";

  // Restore scroll position before first paint when returning via back/forward nav
  useLayoutEffect(() => {
    if (!isBackNav) return;
    const savedY = parseInt(sessionStorage.getItem("portfolioScrollY") || "0");
    if (!savedY) return;
    window.scrollTo(0, savedY);
    const t = setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(savedY, { immediate: true });
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      sessionStorage.setItem("portfolioScrollY", window.scrollY);
    };
  }, []);

  // Scroll to a target section when returning from a subpage with an explicit anchor
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

  return (
    <LanguageProvider>
      <Navbar />
      <ScrollProgressBar />
      <div className="min-h-screen bg-background text-foreground lg:pl-64">
        <HeroSection />
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
