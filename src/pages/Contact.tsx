import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { cropHero } from "@/data/cropImages";
import { Seo } from "@/components/Seo";
import { absoluteUrl, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";

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
      toast.success("Message received. We'll reply to " + parsed.data.email);
    }, 700);
  };

  return (
    <Layout>
      <Seo
        title="Contact Elgon Cooperative | Export Orders & Partnerships"
        description="Contact Elgon Cooperative in Uganda for vanilla, coffee and cocoa export orders, farmer membership, partnerships and buyer inquiries."
        path="/contact"
        image={cropHero.cocoa}
        keywords={["contact Elgon Cooperative", "Uganda vanilla supplier contact", "coffee cocoa export inquiries"]}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Elgon Cooperative",
            url: absoluteUrl("/contact"),
          },
        ]}
      />
      <PageHero
        eyebrow="From Our Farms to the World"
        title="Get in"
        titleAccent="touch."
        subtitle="Buyers, importers, roasters, partners, and farmers, we'd love to hear from you."
        image={cropHero.cocoa}
        imageAlt="Freshly split cocoa pod from the Elgon region"
      />


      <section className="container-full py-16 md:py-20">
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.82fr_1.18fr] xl:gap-12">
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neo-surface flex h-full min-w-0 flex-col p-5 sm:p-6 md:p-8"
          >

            <h2 className="font-heading text-2xl leading-tight text-primary md:text-3xl">
              Reach the cooperative office.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For export orders, partnerships, farmer membership, or visit coordination,
              use the contacts below or send a message through the form.
            </p>

            <div className="mt-8 space-y-4">
              <ContactItem icon={MapPin} title="Address">
                P.O. Box 771, Mbale, Uganda<br />
                Mbale Industrial City Division Council<br />
                Bilinda Village, Bumateba Parish,<br />
                Sironko District
              </ContactItem>
              <ContactItem icon={Phone} title="Phone / WhatsApp">
                <a href="tel:+256782528476" className="block hover:text-accent">+256 782 528 476</a>
                <a href="tel:+256706613980" className="block hover:text-accent">+256 706 613 980</a>
              </ContactItem>
              <ContactItem icon={Mail} title="Email">
                <a href="mailto:elgonvanillacoffee@gmail.com" className="break-all hover:text-accent">
                  elgonvanillacoffee@gmail.com
                </a>
              </ContactItem>
            </div>

            <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="tel:+256782528476"
                className="neo-button btn-label inline-flex justify-center px-5 py-3 text-xs text-primary hover:text-accent"
              >
                Call office
              </a>
              <a
                href="mailto:elgonvanillacoffee@gmail.com"
                className="neo-button btn-label inline-flex justify-center bg-primary px-5 py-3 text-xs text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Email us
              </a>
            </div>
          </motion.aside>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            onSubmit={onSubmit}
            className="neo-surface flex h-full min-w-0 flex-col space-y-5 p-5 sm:p-6 md:p-8 lg:p-10"
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="btn-label text-xs text-primary block mb-2">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-12 w-full rounded-xl border border-white/70 bg-background px-4 focus:outline-none"
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
                  className="h-12 w-full rounded-xl border border-white/70 bg-background px-4 focus:outline-none"
                  placeholder="you@company.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="btn-label text-xs text-primary block mb-2">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="h-12 w-full rounded-xl border border-white/70 bg-background px-4 focus:outline-none"
                placeholder="Partnership, order, farming membership..."
              />
              {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
            </div>
            <div>
              <label className="btn-label text-xs text-primary block mb-2">Message</label>
              <textarea
                rows={7}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-white/70 bg-background px-4 py-3 focus:outline-none"
                placeholder="Tell us about your needs..."
              />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="neo-button btn-label inline-flex justify-center bg-primary px-6 py-4 text-xs text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-60 sm:px-8"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </section>

      <section className="w-full">
        <div className="relative h-[360px] w-full overflow-hidden bg-card sm:h-[420px] md:h-[560px]">
          <iframe
            title="Elgon Cooperative Map"
            src="https://www.google.com/maps?q=Mbale%20Industrial%20City%20Division%20Council%20Bilinda%20Village%20Bumateba%20Parish%20Sironko%20District%20Uganda&z=12&output=embed"
            className="h-full w-full border-0 grayscale-[35%] contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-2 text-[9px] font-semibold uppercase tracking-normal text-primary-foreground shadow-lg sm:left-4 sm:top-4 sm:px-4 sm:text-[10px] sm:tracking-[0.2em]">
            Elgon Location
          </span>
        </div>
      </section>
    </Layout>
  );
};

const ContactItem = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="neo-inset flex min-w-0 gap-3 p-3 sm:gap-4 sm:p-4">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--clay-shadow-sm)]">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="btn-label mb-1 text-xs text-primary">{title}</p>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  </div>
);

export default Contact;
