import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { cropHero } from "@/data/cropImages";

import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10, "Please share a few details").max(1500),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message received - we'll reply to " + parsed.data.email);
    }, 700);
  };

  return (
    <Layout>
      <PageHero
        eyebrow="From Our Farms to the World"
        title="Get in"
        titleAccent="touch."
        subtitle="Buyers, importers, roasters, partners, and farmers - we'd love to hear from you."
        image={cropHero.cocoa}
        imageAlt="Freshly split cocoa pod from the Elgon region"
      />


      <section className="container-full py-20 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-8">
          {[
            { icon: MapPin, title: "Address", body: <>P.O. Box 771, Mbale, Uganda<br />Mbale Industrial City Division Council<br />Bilinda Village, Bumateba Parish, Sironko District</> },
            { icon: Phone, title: "Phone / WhatsApp", body: <><a href="tel:+256782528476" className="block hover:text-accent">+256 782 528 476</a><a href="tel:+256706613980" className="block hover:text-accent">+256 706 613 980</a></> },
            { icon: Mail, title: "Email", body: <a href="mailto:elgonvanillacoffee@gmail.com" className="hover:text-accent break-all">elgonvanillacoffee@gmail.com</a> },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5"
            >
              <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-primary text-primary-foreground">
                <c.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="btn-label text-xs text-primary mb-2">{c.title}</p>
                <div className="text-muted-foreground leading-relaxed text-sm">{c.body}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 p-8 md:p-10 bg-card border border-border rounded-lg shadow-sm space-y-5" noValidate>
          <div>
            <label className="btn-label text-xs text-primary block mb-2">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="btn-label text-xs text-primary block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors"
              placeholder="you@company.com"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="btn-label text-xs text-primary block mb-2">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors"
              placeholder="Partnership, order, farming membership..."
            />
            {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="btn-label text-xs text-primary block mb-2">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your needs..."
            />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-label text-xs bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
