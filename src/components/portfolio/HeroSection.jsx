import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Linkedin, Mail } from "lucide-react";

const AVATAR_URL = "https://media.base44.com/images/public/69d65fddb630545f5349caa8/d7f83ed85_WhatsAppImage2026-04-08at124316.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      

      <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            
            

            
            <h1 className="text-5xl md:text-7xl font-inter font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">Asrin Kilinc</span>
              <br />
              <span className="bg-clip-text text-sky-500 text-3xl from-primary to-accent">Business, IT & Management student

              </span>
            </h1>
            


            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
            
            <a
              href="#contact" className="bg-[hsl(var(--ring))] text-primary-foreground px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Contact



            </a>
            <a
              href="#projects" className="bg-[hsl(var(--input))] text-foreground px-6 py-3 text-sm font-medium rounded-lg border border-border hover:border-primary/50 transition-colors">Projecten



            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
            
            {[
            { icon: Linkedin, href: "https://www.linkedin.com/in/asrin-k/" },
            { icon: Mail, href: "#contact" }].
            map(({ icon: Icon, href }, i) =>
            <a
              key={i}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
              
                <Icon className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-shrink-0">
          
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
              <img
                src={AVATAR_URL}
                alt="Profile"
                className="w-full h-full object-cover scale-125 object-top" />
              
            </div>
            <div className="px-5 rounded-full absolute -inset-4 border border-primary/10 animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors">
        
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}>
          
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.a>
    </section>);

}