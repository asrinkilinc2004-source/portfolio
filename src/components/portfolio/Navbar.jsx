import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const links = [
{ label: "Over mij", href: "#about" },
{ label: "Vaardigheden", href: "#skills" },
{ label: "Projecten", href: "#projects" },
{ label: "Opleiding", href: "#education" },
{ label: "Contact", href: "#contact" }];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""}`
      }>
      
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        

        

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
            
              {link.label}
            </a>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={(e) => {
            const next = theme === "dark" ? "light" : "dark";
            if (!document.startViewTransition) {
              setTheme(next);
              return;
            }
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty("--theme-toggle-x", `${x}px`);
            document.documentElement.style.setProperty("--theme-toggle-y", `${y}px`);
            document.startViewTransition(() => setTheme(next));
          }}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden">
          
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) =>
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors">
              
                  {link.label}
                </a>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.nav>);

}