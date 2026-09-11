import { SiteImage } from "@/components/SiteImage";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { cropHero, pageHeroImages } from "@/data/cropImages";
import { siteVideos } from "@/data/videos";
import { HeroVideoBand } from "@/components/HeroVideoBand";

const OBJECTIVES = [
  "Promote organic farming of vanilla, coffee and cocoa.",
  "Promote value addition in line with Uganda's national strategy.",
  "Support women and smallholder farmers through collective marketing.",
  "Train farmers on farm sustainability and best agricultural practices.",
  "Maintain the highest quality of vanilla, coffee and cocoa.",
  "Export quality vanilla, coffee and cocoa to the world.",
  "Advocate for value-addition facilities in the region.",
  "Create profit sharing partnerships on behalf of the farmers.",
];

const About = () => (
  <Layout>
    <PageHero
      eyebrow="From Our Farms to the World"
      title="13 years building"
      titleAccent="self reliant communities"
      subtitle="Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society [EVCCGCS] was formed by women farmers seeking better organic practices, fair marketing, and stronger livelihoods across the Elgon region."
      image={pageHeroImages.about}
      imageAlt="Hands sorting cured vanilla beans"
      mediaVariant="clearImage"
    />

    {/* Vision / Mission / Philosophy */}
      <section className="container-full py-24 grid gap-12 md:grid-cols-3">
      {[
        { title: "Vision", body: "Building farmers with sustainable farming skills, cohesive, self reliant communities." },
        { title: "Mission", body: "To contribute to the betterment of agro-business Ugandan communities." },
        { title: "Philosophy", body: "Inclusive programs addressing the needs of women and youth all along the vanilla, coffee and cocoa supply chain." },
      ].map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
        >
          <h2 className="min-h-[2rem] font-heading font-semibold text-2xl text-primary mb-3">{v.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{v.body}</p>
        </motion.div>
      ))}
    </section>

    {/* Story */}
    <section className="bg-muted/40">
      <div className="container-full py-24 grid gap-16 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
          <SiteImage
            src={cropHero.vanilla}
            alt="Cured vanilla beans bundled on natural linen"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="font-heading font-bold text-4xl text-primary mb-6 leading-tight">
            One of the leading agro-industrial actors in the Elgon region.
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our know-how builds on 13 years of providing customers with high-quality
              commodities and value addition. We operate in the districts of Sironko,
              Bulambuli, Mbale City, Mbale, Manafwa, Bududa and Kapchorwa.
            </p>
            <p>
              We support women who are vulnerable, including those violated
              domestically, reconciling them with their spouses on the farm and
              improving livelihoods through small-scale business.
            </p>
            <p>
              Our strength lies in the skills of our workers, the diversity of our
              teams, and a deep understanding of the regions in which we operate and
              supply to countries worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Core values */}
    <section className="container-full py-24">
      <div className="max-w-2xl mb-12">
        <p className="eyebrow mb-3">Core Values</p>
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary">
          What we stand for
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { title: "Sustainability", body: "Commitment to environmentally responsible farming practices." },
          { title: "Quality", body: "Unwavering dedication to high-grade cocoa, coffee, and vanilla." },
          { title: "Community Development", body: "Uplifting local communities through employment, training and sustainable practice." },
        ].map((v, i) => (
          <div key={i} className="flex h-full flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover-lift">
            <h3 className="min-h-[3rem] font-heading font-semibold text-xl text-primary mb-3">{v.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Objectives */}
    <section className="bg-primary text-primary-foreground">
      <div className="container-full py-24">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow text-accent mb-3">Our Objectives</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl">
            What we set out to achieve.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {OBJECTIVES.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex h-full gap-4 rounded-2xl border border-primary-foreground/12 bg-primary-foreground/5 p-6"
            >
              <span className="btn-label text-accent text-sm shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-primary-foreground/85 leading-relaxed">{o}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Leadership */}
    <section className="container-full py-24">
      <div className="max-w-3xl">
        <p className="eyebrow mb-3">Leadership</p>
        <h2 className="font-heading font-bold text-4xl text-primary mb-8">
          Guided by experience.
        </h2>
        <div className="p-8 md:p-10 border-l-4 border-accent bg-muted/40 rounded-2xl shadow-sm">
          <p className="font-heading font-semibold text-2xl text-primary">Madoi Saphina Mudebo</p>
          <p className="btn-label text-xs text-accent mt-1">Managing Director</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Reviewed and approved by the cooperative's Board of Members. Contact:
            +256 782 528 476 / +256 706 613 980.
          </p>
        </div>
      </div>
    </section>

    <HeroVideoBand
      src={siteVideos.sourcing}
      poster={pageHeroImages.about}
      label="Elgon cooperative sourcing and farming footage"
      className="-mb-24 md:min-h-[calc(76svh+6rem)]"
      overlayClassName="bg-none"
    />
  </Layout>
);

export default About;
