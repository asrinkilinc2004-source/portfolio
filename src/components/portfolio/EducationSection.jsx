import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeLeft, fadeUp } from "@/lib/motion";

export default function EducationSection() {
  const { t } = useLanguage();
  const { label, title, timeline } = t.education;

  return (
    <section id="education" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight"><span className="marker-highlight">{title}</span></h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {timeline.map((item, i) => (
              <motion.div key={i} {...fadeLeft(i * 0.08)} className="relative pl-16 md:pl-20">
                <div className="absolute left-3 md:left-6 top-1 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                <h3 className="text-xl font-bold mt-1 mb-1"><span className="marker-highlight">{item.title}</span></h3>
                <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
