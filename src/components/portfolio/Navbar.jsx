import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("");
  const [hovered,        setHovered]        = useState(null);
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  // Each link gets a unique hand-drawn underline path
  const UNDERLINES = [
    // About — gentle single S-wave
    "M1,4.5 C18,1.5 38,5.5 55,2.8 C72,0.5 88,4.8 99,3.2",
    // Skills — tight high-frequency squiggle
    "M1,3.5 C10,1 19,5.5 28,3 C37,0.5 46,5 55,3 C64,0.5 73,5.5 82,3 C90,1 96,4.5 99,3.5",
    // Projects — one deep asymmetric dip
    "M1,2.5 C22,2 38,6 55,3.5 C68,1.5 82,4.5 99,2",
    // Education — two peaks like a heartbeat
    "M1,4 C12,4 18,1 28,1 C38,1 44,5 55,5 C64,5 72,1 82,1 C90,1 95,3.5 99,3.5",
    // Contact — starts high, ends with a final flick
    "M1,2 C20,2 40,5 58,4 C72,3 84,1.5 92,3 C95,3.8 97,5 99,4.5",
  ];

  const links = [
    { label: t.nav.about,     href: "#about"     },
    { label: t.nav.skills,    href: "#skills"    },
    { label: t.nav.projects,  href: "#projects"  },
    { label: t.nav.education, href: "#education" },
    { label: t.nav.contact,   href: "#contact"   },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Clear active section when back in the hero (top half of first viewport)
      if (window.scrollY < window.innerHeight * 0.5) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["about", "skills", "projects", "education", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(`#${id}`); },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const toggleTheme = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!document.startViewTransition || isMobile) { setTheme(next); return; }
    document.documentElement.style.setProperty("--theme-toggle-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--theme-toggle-y", `${e.clientY}px`);
    document.startViewTransition(() => setTheme(next));
  };

  return (
    <motion.nav
      dir="ltr"
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}>

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => {
            const isActive = activeSection === link.href;
            const drawn = isActive || hovered === i;
            return (
              <a key={link.href} href={link.href}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative text-sm transition-colors duration-200 pb-1 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-[6px] pointer-events-none text-primary">
                  <svg height="6" width="100%" preserveAspectRatio="none" viewBox="0 0 100 6">
                    <motion.path
                      d={UNDERLINES[i]}
                      stroke="currentColor" strokeWidth="2.2" fill="none"
                      strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
                      transition={{
                        pathLength: { duration: 0.35, ease: "easeInOut" },
                        opacity: { duration: 0, delay: drawn ? 0 : 0.35 },
                      }}
                    />
                  </svg>
                </span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden">
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`text-sm transition-colors ${
                    activeSection === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
