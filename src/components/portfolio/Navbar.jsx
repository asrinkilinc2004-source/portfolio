import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { smoothScrollTo } from "@/lib/scroll";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
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
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const headerOffset = isDesktop ? 24 : 84; // clear the fixed mobile top bar
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    smoothScrollTo(top);
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileOpen(false);
    if (!isHome) {
      navigate("/", { state: { scrollTo: link.id } });
    } else {
      scrollTo(link.id);
    }
  };

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

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const homeHref = () => (
    <a href="/" onClick={(e) => { if (isHome) { e.preventDefault(); smoothScrollTo(0); } }}
      className="text-sm font-semibold text-primary hover:text-primary/80 tracking-wide">
      AK
    </a>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-56 z-50 flex-col justify-between border-r border-border bg-background px-6 py-10">
        <div>
          {homeHref()}
          <nav className="mt-12 flex flex-col gap-1">
            {links.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a key={link.href} href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative pl-4 py-2 text-sm border-l-2 transition-colors duration-200 ${
                    isActive
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/30"
                  }`}>
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <motion.nav
        dir="ltr"
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          {homeHref()}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden">
              <div className="px-6 py-4 flex flex-col gap-4">
                {links.map((link) => (
                  <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link)}
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
    </>
  );
}
