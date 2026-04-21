import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

const timeline = [
  {
    year: "Sept 2017 — Juli 2022",
    title: "HAVO — Natuur & Techniek met Wiskunde B",
    institution: "Lyceum Sancta Maria",
    description: "Middelbare school afgerond op HAVO-niveau met profiel Natuur & Techniek en Wiskunde B.",
    icon: GraduationCap,
  },
  {
    year: "Mei 2024",
    title: "Certificaat Natuurkunde voor Piloten",
    institution: "Wismon, Utrecht",
    description: "Behaalde het certificaat Module Natuurkunde voor Piloten — een aanvullende kwalificatie op het gebied van toegepaste natuurkunde.",
    icon: Award,
  },
  {
    year: "Sept 2024 — Heden",
    title: "Bachelor's in Information Technology",
    institution: "Hogeschool van Amsterdam (HvA)",
    description: "IT studeren met een consultingfocus — inclusief software, systemen, projectmanagement en stakeholdercommunicatie. Elk semester draait om echte klantprojecten.",
    icon: GraduationCap,
  },
  {
    year: "Semester 1 · 2024/2025",
    title: "DOKKI€ & SafeNotes",
    institution: "HvA — Eerste Semester Projecten",
    description: "Twee applicaties gebouwd in het eerste semester: DOKKI€, een groepsuitgaven-splitter, en SafeNotes, een veilig notitieplatform met authenticatie.",
    icon: Award,
  },
  {
    year: "Semester 2 · 2024/2025",
    title: "Rituals — CO₂ Emissions Dashboard",
    institution: "HvA — Klant: Rituals Cosmetics",
    description: "Een duurzaamheidsdashboard ontwikkeld voor Rituals, waarmee CO₂-uitstoot per regio en maand wordt bijgehouden, inclusief rapportage en analysetools ter ondersteuning van ESG-doelstellingen.",
    icon: Award,
  },
  {
    year: "Semester 3 · 2025/2026",
    title: "Ministerie van Defensie — Epicflow",
    institution: "HvA — Klant: Ministerie van Defensie",
    description: "Een inkoopbeheerdashboard gebouwd voor het Ministerie van Defensie, met visualisaties van contractrisico's, leveranciersprestaties en budgetbewaking onder het Epicflow-merk.",
    icon: Award,
  },
  {
    year: "Semester 4 · 2026",
    title: "Studio Semester — AI Face Tracking Camera",
    institution: "HvA — Dark Tech · Profiel: AI-Engineer",
    description: "Momenteel werkend in een team van 5 aan een studiosemesterproject onder het thema Dark Tech. We bouwen een AI-gestuurde gezichtsvolgende camera die het ongemakkelijke gevoel creëert altijd bekeken te worden — en zo de grenzen van surveillancetechnologie en menselijke waarneming verkent.",
    icon: Award,
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-sm text-primary tracking-wider">04 —</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">Opleiding</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {timeline.map(({ year, title, institution, description, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative pl-16 md:pl-20"
              >
                <div className="absolute left-3 md:left-6 top-1 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <span className="font-mono text-xs text-primary tracking-wider">{year}</span>
                <h3 className="text-xl font-bold mt-1 mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{institution}</p>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}