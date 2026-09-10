import { cropHero } from "@/data/cropImages";
import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, Users, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CollectionCard } from "@/components/CollectionCard";
import { PageHero, heroBtn } from "@/components/PageHero";


import { ProductCard } from "@/components/ProductCard";
import { categories, getFeaturedProducts } from "@/data/products";

const PRINCIPLES = ["Sustainability", "Traceability", "Consistency", "Community Powered"];

const Index = () => {
  const featured = getFeaturedProducts();
  return (
    <Layout>
      {/* HERO */}
      <PageHero
        eyebrow="From Our Farms to the World"
        title="Premium Ugandan"
        titleAccent="Vanilla, Coffee & Cocoa"
        subtitle="Organically grown by 3,000+ farmers on the fertile slopes of Mount Elgon. Exporting quality. Empowering communities."
        image={cropHero.cocoa}
        imageAlt="Open cocoa pod and dried cocoa beans"
        size="full"
        bleedTop
      >
        <Link to="/products" className={heroBtn("solid")}>
          <Leaf className="w-4 h-4" /> Explore Products
        </Link>
        <Link to="/farmers" className={heroBtn("gold")}>
          Meet Our Farmers
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </PageHero>


      {/* Mission strip */}
      <section className="bg-accent text-accent-foreground">
        <div className="container-full py-6 marquee">
          <div className="marquee-content gap-16 pr-16">
            {[...PRINCIPLES, ...PRINCIPLES, ...PRINCIPLES].map((p, i) => (
              <span key={i} className="btn-label text-sm inline-flex items-center gap-4">
                <Leaf className="w-4 h-4" /> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-full py-24 md:py-32">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow mb-3">Our Products</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
            Three crops. One cooperative. One promise.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Organically grown and value-added by farmers across Sironko, Bulambuli,
            Mbale, Manafwa, Bududa and Kapchorwa.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((c, i) => (
            <CollectionCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-full py-20 grid gap-10 md:grid-cols-4">
          {[
            { n: "13+", l: "Years of expertise" },
            { n: "3,000+", l: "Farmers in the cooperative" },
            { n: "6", l: "Districts across Elgon" },
            { n: "100t", l: "Vanilla per season" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-heading font-bold text-5xl md:text-6xl text-accent mb-2">{s.n}</p>
              <p className="text-sm text-primary-foreground/70">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-full py-24 md:py-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Featured</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
              Signature exports
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex btn-label text-xs text-primary hover:text-accent transition-colors items-center gap-2 link-underline"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40">
        <div className="container-full py-24 md:py-28 grid gap-12 md:grid-cols-3">
          {[
            { icon: Leaf, title: "Sustainability", body: "Environmentally responsible farming practices, from soil to shipment." },
            { icon: ShieldCheck, title: "Quality", body: "Unwavering dedication to high-grade vanilla, coffee and cocoa." },
            { icon: Users, title: "Community", body: "Uplifting women, youth and vulnerable groups through training and fair trade." },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-primary text-primary-foreground mb-5">
                <v.icon className="w-5 h-5" />
              </span>
              <h3 className="font-heading font-semibold text-2xl text-primary mb-3">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Farmers teaser */}
      <section className="container-full py-24 md:py-32 grid gap-12 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
          <SiteImage
            src={cropHero.coffee}
            alt="Green and roasted coffee beans spilling from a burlap sack"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow mb-3">Our Farmers</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-6 leading-tight">
            Women, youth, and communities at the heart of every bean.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We support women and vulnerable groups with organic farming training,
            collective marketing, and profit-sharing — building self-reliant
            communities across Uganda's Elgon region.
          </p>
          <div className="flex items-center gap-2 mb-8 text-primary">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="btn-label text-xs">3,000+ farmers across 6 districts</span>
          </div>
          <Link
            to="/farmers"
            className="btn-label text-xs inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm hover:bg-secondary transition-colors"
          >
            Meet the farmers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-full py-24 text-center">
          <p className="eyebrow text-accent mb-4">Buyers · Importers · Roasters</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 max-w-3xl mx-auto leading-tight">
            Ready to source from Uganda's Elgon region?
          </h2>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto mb-10">
            Minimum order: one 19.2 ton container. Smaller pre-arranged quantities available.
          </p>
          <Link
            to="/inquire"
            className="btn-label text-xs inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-sm hover:bg-accent/90 transition-colors"
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
