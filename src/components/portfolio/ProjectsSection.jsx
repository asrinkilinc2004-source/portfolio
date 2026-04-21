import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    semester: "Semester 3",
    title: "Ministerie van Defensie — Epicflow Dashboard",
    description:
      "Een inkoopbeheerdashboard voor het Nederlandse Ministerie van Defensie, gebouwd onder het Epicflow-merk. Visualiseert contractrisiconiveaus, leveranciersprestaties, budget vs. uitgaven en inkooptijdlijnen. Bijgedragen aan requirementsanalyse, UX-structuur en datapresentatie.",
    tags: ["Dashboard", "Overheid", "Datavisualisatie", "Inkoop"],
    image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/2bc8d0b12_hi-fi.jpg",
  },
  {
    semester: "Semester 2",
    title: "Rituals — CO₂ Emissions Dashboard",
    description:
      "Een duurzaamheidsdashboard dat CO₂-uitstoot per regio en maand bijhoudt voor Rituals Cosmetics. Bevat datavisualisatie, maandelijkse trendanalyse en rapportagetools. Gericht op het vertalen van duurzaamheids-KPI's naar bruikbare inzichten.",
    tags: ["Duurzaamheid", "Dashboard", "CO₂", "Data-analyse"],
    image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/521c94e01_Afbeelding1.png",
  },
  {
    semester: "Semester 1",
    title: "DOKKI€ — Group Expense Splitter",
    description:
      "Een webapp waarmee je moeiteloos gedeelde uitgaven binnen een vriendengroep kunt bijhouden en automatisch verdelen. Bijgedragen aan productvisiee, UX-flows en overall requirements.",
    tags: ["Web App", "UX Design", "JavaScript", "Product"],
    image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/eb1415f00_nieuwe-versie.jpg",
  },
  {
    semester: "Semester 1",
    title: "SafeNotes — Secure Note-Taking App",
    description:
      "Een privacy-first notitieplatform met gebruikersauthenticatie, snelle invoer en veilige opslag. Sleutelrol gespeeld bij het definiëren van requirements, gebruikersflows en de authenticatie-ervaring.",
    tags: ["React", "Node.js", "Auth", "HvA Project"],
    image: "https://media.base44.com/images/public/69d65fddb630545f5349caa8/ef1cf4343_safenotes1.jpg",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-sm text-primary tracking-wider">03 —</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">Projecten</h2>
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
                  <span className="inline-block font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-1 mb-3 w-fit">
                    {project.semester}
                  </span>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}