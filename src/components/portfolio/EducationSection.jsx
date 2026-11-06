import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

export default function EducationSection() {
  const { t } = useLanguage();
  const { label, title, timeline } = t.education;

  return (
    <section id="education" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">{title}</h2>
        </motion.div>

        <div className="divide-y divide-border border-t border-border">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(Math.min(i * 0.05, 0.3))}
              className="grid sm:grid-cols-[9rem_1fr] gap-2 sm:gap-8 py-6"
            >
              <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
