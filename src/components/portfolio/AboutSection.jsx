import { motion } from "framer-motion";
import { GraduationCap, Lightbulb, Palette, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

const ICONS = [Lightbulb, GraduationCap, Palette, Rocket];

export default function AboutSection() {
  const { t } = useLanguage();
  const { label, title, p1, p2, highlights, stats } = t.about;

  return (
    <section id="about" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">{title}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div {...fadeUp(0.1)}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{p1}</p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">{p2}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t-2 border-primary/30">
              {stats.map(({ value, suffix, label: statLabel }, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-primary font-mono">{value}{suffix}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono tracking-wider">{statLabel}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="divide-y divide-border border-t border-border">
            {highlights.map(({ label: hl, desc }, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div key={hl} {...fadeUp(0.08 * i)} className="flex items-start gap-4 py-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{hl}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
