import { ArrowDown, Linkedin, Mail, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp, fadeIn } from "@/lib/motion";

const AVATAR_URL = "/ik.png";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden px-6 bg-primary dark:bg-[#15609e]">
      <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20">
        <div className="w-full min-w-0 flex-1 text-center lg:text-left">
          <motion.h1 {...fadeUp(0)} className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-white">Asrin <span className="text-white/90">Kilinc</span></span>
            <span className="block mt-6 text-white/90 text-3xl leading-tight font-medium">
              {t.hero.subtitle}
            </span>
          </motion.h1>

          <motion.div {...fadeUp(0.12)} className="flex items-center gap-4 mt-8 justify-center lg:justify-start flex-wrap">
            <a href="#contact" className="inline-block bg-white text-primary px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]">
              {t.hero.cta_contact}
            </a>
            <a href="#projects" className="inline-block bg-white/15 text-white px-6 py-3 text-sm font-medium rounded-lg border border-white/30 hover:bg-white/25 transition-colors active:scale-[0.98]">
              {t.hero.cta_projects}
            </a>
            <a href="/cv_def.pdf" download="CV_Asrin_Kilinc.pdf" className="inline-flex items-center gap-2 bg-white/15 text-white px-6 py-3 text-sm font-medium rounded-lg border border-white/30 hover:bg-white/25 transition-colors active:scale-[0.98]">
              <Download className="w-4 h-4" />
              {t.hero.cta_cv}
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
            {[
              { icon: Linkedin, href: "https://www.linkedin.com/in/asrin-k/" },
              { icon: Mail,     href: "#contact" },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white/70 hover:bg-white hover:text-primary hover:border-white transition-colors duration-200">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.1)} className="flex-shrink-0">
          <div className="relative p-6">
            <div className="relative z-10 w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
              <img src={AVATAR_URL} alt="Profile" decoding="async" fetchPriority="high" className="w-full h-full object-cover object-top" />
            </div>
            <div className="rounded-full absolute inset-0 border border-primary/10" />
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        {...fadeIn(0.4)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
