import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { cropHero } from "@/data/cropImages";
import { siteVideos } from "@/data/videos";
import { Seo } from "@/components/Seo";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

import { products, categories } from "@/data/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  country: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  productIds: z.array(z.string()).min(1, "Select at least one product"),
  volume: z.string().trim().min(1).max(100),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const Inquire = () => {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get("product");

  const [form, setForm] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    productIds: [] as string[],
    volume: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselect) {
      const found = products.find((p) => p.slug === preselect);
      if (found) setForm((f) => ({ ...f, productIds: [found.id] }));
    }
  }, [preselect]);

  const toggleProduct = (id: string) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id) ? f.productIds.filter((x) => x !== id) : [...f.productIds, id],
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
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
    const selectedProducts = products.filter((product) => parsed.data.productIds.includes(product.id));
    const inquiryPayload = {
      name: parsed.data.name,
      company: parsed.data.company || null,
      country: parsed.data.country || null,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      product_slugs: selectedProducts.map((product) => product.slug),
      volume: parsed.data.volume || null,
      message: parsed.data.message || null,
      source: "inquire",
      status: "new",
    };
    try {
      const { data, error } = await supabase.functions.invoke("submit-inquiry", {
        body: {
          name: inquiryPayload.name,
          company: parsed.data.company,
          country: parsed.data.country,
          email: inquiryPayload.email,
          phone: parsed.data.phone,
          productSlugs: inquiryPayload.product_slugs,
          volume: parsed.data.volume,
          message: parsed.data.message,
          source: "inquire",
        },
      });

      if (error) {
        const { error: insertError } = await supabase.from("inquiries").insert(inquiryPayload);
        if (insertError) throw insertError;
      }
      if (data?.error) throw new Error(data.error);

      setSubmitting(false);
      setForm({ name: "", company: "", country: "", email: "", phone: "", productIds: [], volume: "", message: "" });
      toast.success(data?.message ?? "Inquiry received. We'll respond within 2 business days.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "We could not submit your inquiry. Please try again.";
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Request a Quote | Ugandan Vanilla, Coffee & Cocoa Exports"
        description="Request pricing, lead times and shipping details for Ugandan vanilla, Arabica coffee and cocoa from Elgon Cooperative."
        path="/inquire"
        image={cropHero.vanilla}
        keywords={["request vanilla quote", "Uganda coffee export quote", "Uganda cocoa supplier quote"]}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Request Quote", path: "/inquire" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Request a Quote",
            url: absoluteUrl("/inquire"),
          },
        ]}
      />
      <PageHero
        eyebrow="From Our Farms to the World"
        title="Request a"
        titleAccent="quote."
        subtitle="Tell us what you need, product, volume, destination, and we'll respond with pricing, lead times, and shipping details."
        image={cropHero.vanilla}
        imageAlt="Bundles of cured Ugandan vanilla beans"
        videoSrc={siteVideos.export}
      />


      <section className="container-full max-w-4xl py-16 md:py-20">
        <form onSubmit={onSubmit} className="neo-surface min-w-0 space-y-8 p-5 sm:p-8 md:p-12" noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Company" error={errors.company}>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Country" error={errors.country}>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Phone (optional)" error={errors.phone}>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Volume estimate" error={errors.volume}>
              <input placeholder="e.g. 1 x 19.2t container / month" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <div>
            <p className="btn-label text-xs text-primary mb-3">Products of interest</p>
            <div className="grid gap-2 md:grid-cols-3">
              {categories.map((c) => {
                const catProducts = products.filter((p) => p.category === c.id);
                return catProducts.map((p) => {
                  const selected = form.productIds.includes(p.id);
                  return (
            <button
              key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.id)}
                      className={cn(
                        "flex h-full min-h-[6.75rem] min-w-0 flex-col p-4 text-left transition-all",
                        selected
                          ? "neo-inset text-primary"
                          : "neo-surface-sm hover:text-primary"
                      )}
                    >
                      <p className="btn-label text-[10px] mb-2 opacity-70">{c.name}</p>
                      <p className="mt-auto min-h-[2.5rem] text-sm font-heading font-semibold leading-snug">{p.name}</p>
                    </button>
                  );
                });
              })}
            </div>
            {errors.productIds && <p className="text-xs text-destructive mt-2">{errors.productIds}</p>}
          </div>

          <Field label="Message (optional)" error={errors.message}>
            <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={cn(inputCls, "h-auto py-3 resize-none")} />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="neo-button btn-label inline-flex justify-center bg-primary px-6 py-4 text-xs text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-60 sm:px-8"
          >
            {submitting ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      </section>
    </Layout>
  );
};

const inputCls =
  "w-full h-12 px-4 bg-background border border-white/70 rounded-xl focus:outline-none transition-colors";

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="btn-label text-xs text-primary block mb-2">{label}</label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default Inquire;
