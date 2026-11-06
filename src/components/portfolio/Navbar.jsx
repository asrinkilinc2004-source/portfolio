import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("");
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const links = [
    { label: t.nav.about,     href: "#about",      id: "about"      },
    { label: t.nav.skills,    href: "#skills",     id: "skills"     },
    { label: t.nav.projects,  href: "#projects",   id: "projects"   },
    { label: t.nav.education, href: "#education",  id: "education"  },
    { label: t.nav.contact,   href: "#contact",    id: "contact"    },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    if (!isHome) {
      navigate("/", { state: { scrollTo: link.id } });
    } else {
      scrollTo(link.id);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.nav
      dir="ltr"
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/85 dark:bg-[#080f18] backdrop-blur-xl ${
        scrolled ? "border-b border-primary/30" : ""
      }`}>

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Home button */}
        <a href="/" onClick={(e) => { if (isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
          className="text-sm font-semibold text-primary hover:text-primary/80 dark:text-white dark:hover:text-white transition-colors duration-200 tracking-wide">
          AK
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a key={link.href} href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative text-sm transition-colors duration-200 pb-1 dark:text-white dark:hover:text-white ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-[2px] bg-current rounded-full origin-left transition-transform duration-300 ease-out w-full"
                  style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
                />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground dark:text-white hover:bg-primary dark:hover:bg-[#15609e] hover:text-white hover:border-primary transition-all duration-200">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground dark:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 dark:bg-[#080f18] backdrop-blur-xl border-b border-border overflow-hidden">
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={(e) => { handleNavClick(e, link); setMobileOpen(false); }}
                  className={`text-sm transition-colors dark:text-white dark:hover:text-white ${
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
