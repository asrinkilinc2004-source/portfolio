import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

export default function ContactSection() {
  const { t } = useLanguage();
  const c = t.contact;
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("https://formspree.io/f/meevrkop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSent(true); setForm({ name: "", email: "", subject: "", message: "" }); }
      else setError(true);
    } catch { setError(true); }
    finally { setSending(false); }
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{c.label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">{c.title}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{c.intro}</p>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{c.email_label}</p>
                  <p className="text-foreground">asrinkilinc@hotmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{c.location_label}</p>
                  <p className="text-foreground">{c.location_value}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-5" onSubmit={handleSubmit}>
            {sent  && <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">{c.form.success}</div>}
            {error && <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{c.form.error}</div>}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder={c.form.name}  className="bg-card border-border focus:border-primary/50 h-12" value={form.name}    onChange={(e) => setForm({ ...form, name:    e.target.value })} required />
              <Input placeholder={c.form.email} type="email" className="bg-card border-border focus:border-primary/50 h-12" value={form.email}   onChange={(e) => setForm({ ...form, email:   e.target.value })} required />
            </div>
            <Input placeholder={c.form.subject} className="bg-card border-border focus:border-primary/50 h-12" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <Textarea placeholder={c.form.message} className="bg-card border-border focus:border-primary/50 min-h-[140px] resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <Button type="submit" disabled={sending} className="bg-primary text-primary-foreground hover:opacity-90 h-12 px-8">
              <Send className="w-4 h-4 mr-2" />
              {sending ? c.form.sending : c.form.send}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
