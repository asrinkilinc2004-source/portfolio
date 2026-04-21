import React from "react";
import { motion } from "framer-motion";
import { Code2, GraduationCap, Lightbulb, Rocket } from "lucide-react";

const highlights = [
{ icon: Lightbulb, label: "Consultant Mindset", desc: "Translating tech into business value" },
{ icon: GraduationCap, label: "IT Student", desc: "Studying Information Technology at university" },
{ icon: Code2, label: "Tech-Savvy", desc: "Understand code, architecture & systems" },
{ icon: Rocket, label: "Hands-On Builder", desc: "Built real-world apps from idea to launch" }];


export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16">
          
          <span className="font-mono text-sm text-primary tracking-wider">01 —</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">Over mij</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">Ik ben Asrin Kilinc — 22 jaar, IT-student en iemand die graag uitzoekt hoe dingen werken. Ik zit precies tussen techniek en mensen in: ik begrijp hoe systemen worden gebouwd, maar mijn kracht ligt in het signaleren van problemen, het doordenken van oplossingen en ervoor zorgen dat iedereen op één lijn zit.



            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">Ik heb gewerkt aan echte projecten — van een groepsuitgaven-splitter tot een veilige notitie-app. Ik houd ervan om dingen voor elkaar te krijgen: of dat nu het afbakenen van een project is, samenwerken met ontwikkelaars, of er zelf induiken en het uitzoeken.



            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label, desc }, i) =>
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group">
              
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{label}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}