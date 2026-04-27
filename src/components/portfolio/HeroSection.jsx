import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Linkedin, Mail } from "lucide-react";

const AVATAR_URL = "https://media.base44.com/images/public/69d65fddb630545f5349caa8/d7f83ed85_WhatsAppImage2026-04-08at124316.jpg";
const SUBTITLE = "Business, IT & Management student";

const PARTICLES = [
  { id: 0,  x: 8,  y: 12, s: 2.5, d: 14, dl: 0   },
  { id: 1,  x: 22, y: 68, s: 1.5, d: 18, dl: 1.5  },
  { id: 2,  x: 35, y: 30, s: 2,   d: 12, dl: 3    },
  { id: 3,  x: 50, y: 80, s: 1,   d: 20, dl: 0.5  },
  { id: 4,  x: 63, y: 20, s: 3,   d: 16, dl: 2    },
  { id: 5,  x: 78, y: 55, s: 1.5, d: 13, dl: 4    },
  { id: 6,  x: 90, y: 10, s: 2,   d: 17, dl: 1    },
  { id: 7,  x: 15, y: 45, s: 1,   d: 22, dl: 3.5  },
  { id: 8,  x: 42, y: 88, s: 2.5, d: 11, dl: 0.8  },
  { id: 9,  x: 70, y: 35, s: 1.5, d: 19, dl: 2.5  },
  { id: 10, x: 85, y: 75, s: 2,   d: 15, dl: 1.2  },
  { id: 11, x: 5,  y: 60, s: 1,   d: 21, dl: 3.8  },
  { id: 12, x: 55, y: 5,  s: 3,   d: 10, dl: 0.3  },
  { id: 13, x: 30, y: 92, s: 1.5, d: 16, dl: 4.5  },
  { id: 14, x: 95, y: 48, s: 2,   d: 13, dl: 2.2  },
  { id: 15, x: 18, y: 25, s: 1,   d: 24, dl: 1.8  },
  { id: 16, x: 72, y: 90, s: 2.5, d: 12, dl: 0.6  },
  { id: 17, x: 46, y: 50, s: 1.5, d: 18, dl: 3.2  },
];

function useTypingOnce(text, speed = 55, startDelay = 700) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, []);

  return displayed;
}

export default function HeroSection() {
  const subtitle = useTypingOnce(SUBTITLE);
  const showCursor = subtitle.length < SUBTITLE.length;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>

            <h1 className="text-5xl md:text-7xl font-inter font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">Asrin Kilinc</span>
              <br />
              <span className="text-primary text-3xl">
                {subtitle}
                {showCursor && (
                  <span className="inline-block w-0.5 h-7 bg-primary ml-0.5 align-middle animate-pulse" />
                )}
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-4 mt-8 justify-center lg:justify-start">

            <a
              href="#contact"
              className="bg-[hsl(var(--ring))] text-primary-foreground px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              Contact
            </a>
            <a
              href="#projects"
              className="bg-[hsl(var(--input))] text-foreground px-6 py-3 text-sm font-medium rounded-lg border border-border hover:border-primary/50 transition-colors">
              Projecten
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-5 mt-8 justify-center lg:justify-start">

            {[
              { icon: Linkedin, href: "https://www.linkedin.com/in/asrin-k/" },
              { icon: Mail, href: "#contact" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-shrink-0">

          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
              <img
                src={AVATAR_URL}
                alt="Profile"
                className="w-full h-full object-cover scale-125 object-top"
              />
            </div>
            <div className="px-5 rounded-full absolute -inset-4 border border-primary/10 animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors">

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
