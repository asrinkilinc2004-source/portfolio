import React, { useState } from "react";
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
  const [splashDone, setSplashDone] = useState(
    // If already shown this session, skip immediately
    () => !!sessionStorage.getItem("splash")
  );

  return (
    <LanguageProvider>
      <SplashIntro onDone={() => setSplashDone(true)} />
      <div
        className="min-h-screen bg-background text-foreground"
        style={{
          opacity:   splashDone ? 1 : 0,
          transform: splashDone ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <ScrollProgressBar />
        <CustomCursor />
        <Navbar />
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
