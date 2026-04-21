import React from "react";
import { Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Asrin Kilinc. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {[
            { icon: Linkedin, href: "https://www.linkedin.com/in/asrin-k/" },
            { icon: Mail, href: "#contact" },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}