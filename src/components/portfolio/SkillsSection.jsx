import React from "react";
import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Consulting",
    skills: ["Requirementsanalyse", "Stakeholderbeheer", "Probleemoplossing", "Projectscoping"],
  },
  {
    title: "Tech Kennis",
    skills: ["HTML/CSS", "SQL", "Python"],
  },
  {
    title: "Tools",
    skills: ["Git", "Figma", "Notion", "VS Code", "PowerBI"],
  },
  {
    title: "Soft Skills",
    skills: ["Communicatie", "Agile/Scrum", "Documentatie", "Teamwork"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-sm text-primary tracking-wider">02 —</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">Vaardigheden & Tech</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <h3 className="font-mono text-sm text-primary mb-5 tracking-wider">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-md bg-secondary text-secondary-foreground border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}