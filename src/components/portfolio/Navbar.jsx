import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("");
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

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
          {links.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a key={link.href} href={link.href}
                className={`relative text-sm transition-colors duration-200 group pb-1 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[6px] overflow-hidden pointer-events-none text-primary transition-[width] duration-300 ease-out ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}>
                  <svg height="6" width="100%" preserveAspectRatio="none" viewBox="0 0 100 6">
                    <path d="M1,4.5 C10,1.5 20,5.5 33,3 C46,0.5 55,5 67,3 C78,1 88,5 99,3.5"
                      stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
