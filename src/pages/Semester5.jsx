import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "../components/portfolio/Navbar";
import CustomCursor from "../components/portfolio/CustomCursor";
import ScrollProgressBar from "../components/portfolio/ScrollProgressBar";
import BackToTop from "../components/portfolio/BackToTop";
import { LanguageProvider } from "../lib/LanguageContext";
import { useLenis } from "../lib/useLenis";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

function Semester5Content() {
  const navigate = useNavigate();
  useLenis();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgressBar />
      <CustomCursor />
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.button
          {...fadeUp(0)}
          onClick={() => navigate("/")}
          className="mb-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar projecten
        </motion.button>

        <motion.div {...fadeUp(0.08)}>
          <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1">
            Semester 5
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            Stage — VistaTelecom
          </h1>
          <p className="text-muted-foreground text-sm font-mono">Wordt binnenkort aangevuld.</p>
        </motion.div>

        <motion.div {...fadeUp(0.14)} className="mt-8 rounded-xl overflow-hidden border border-border flex items-center justify-center p-10" style={{ background: "#fff" }}>
          <img
            src="/vista.png"
            alt="VistaTelecom"
            className="max-h-28 w-auto object-contain"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </motion.div>

        <motion.div
          {...fadeUp(0.18)}
          className="mt-16 rounded-xl border border-border bg-card p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="font-mono text-xs text-primary/50 tracking-widest uppercase">Binnenkort</p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Deze pagina wordt gevuld naarmate de stage vordert.
          </p>
        </motion.div>
      </main>

      <BackToTop />
    </div>
  );
}

export default function Semester5Page() {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <Semester5Content />
      </LanguageProvider>
    </ThemeProvider>
  );
}
