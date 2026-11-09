import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

export default function SkillsSection() {
  const { t } = useLanguage();
  const { label, title, categories } = t.skills;

  return (
    <section id="skills" className="py-24 md:py-32 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">{title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.title} {...fadeUp(i * 0.08)}>
              <div className="p-6 rounded-xl bg-background border border-border border-l-4 border-l-primary hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-colors duration-300 h-full">
                <h3 className="font-mono text-sm text-primary mb-5 tracking-wider">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-md bg-primary/8 text-foreground border border-primary/40 hover:border-primary/70 hover:bg-primary/15 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
