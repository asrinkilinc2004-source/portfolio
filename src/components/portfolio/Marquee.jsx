import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Marquee() {
  const { t } = useLanguage();

  // Flatten all skills from every category
  const skills = t.skills.categories.flatMap((c) => c.skills);
  // Duplicate for seamless loop
  const items = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden py-4 my-10 border-y border-border group select-none">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="marquee-track flex w-max"
        style={{ animation: "marquee 35s linear infinite" }}
      >
        {items.map((skill, i) => (
          <span
            key={i}
            className="text-sm font-mono text-muted-foreground whitespace-nowrap flex items-center"
          >
            <span className="px-5">{skill}</span>
            <span className="text-primary/50 text-xs">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
