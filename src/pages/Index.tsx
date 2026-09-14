import { cropHero, pageHeroImages } from "@/data/cropImages";
import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { CollectionCard } from "@/components/CollectionCard";
import { PageHero, heroBtn } from "@/components/PageHero";
import { siteVideos } from "@/data/videos";
import { HeroVideoBand } from "@/components/HeroVideoBand";
import { useFarmers, usePartners, type FarmerRow, type PartnerLogoRow } from "@/hooks/useCatalog";
import { useMediaUrl } from "@/lib/media";
import { categories, type CategorySlug } from "@/data/products";

const PRINCIPLES = [
  { label: "Sustainability" },
  { label: "Traceability" },
  { label: "Consistency" },
  { label: "Community Powered" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const FeaturedFarmerCard = ({ farmer, index }: { farmer: FarmerRow; index: number }) => {
  const photo = useMediaUrl(farmer.photo_url);
  const fallback = cropHero[(farmer.crops?.[0] as CategorySlug) ?? "coffee"] ?? cropHero.coffee;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <Link to={`/farmers/${farmer.slug ?? farmer.id}`} className="block h-full">
        <div className="relative aspect-[4/5] min-h-[24rem] overflow-hidden bg-white sm:min-h-[27rem] lg:min-h-[31rem]">
          {photo || fallback ? (
            <>
              <SiteImage
                src={photo || fallback}
                fallbackSrc={fallback}
                alt=""
                loading="lazy"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
              />
              <div className="absolute inset-x-2 top-2 bottom-[8.75rem] grid place-items-center overflow-hidden rounded-[1.35rem] bg-white/85">
                <SiteImage
                  src={photo || fallback}
                  fallbackSrc={fallback}
                  alt={`${farmer.name}, ${farmer.role}`}
                  loading="lazy"
                  className="h-full w-full object-contain object-center brightness-110 contrast-110 saturate-115"
                />
              </div>
            </>
          ) : (
            <div className="absolute inset-x-2 top-2 bottom-[8.75rem] grid place-items-center rounded-[1.35rem] bg-secondary text-secondary-foreground">
              <span className="font-heading text-4xl font-bold">{initials(farmer.name)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#062516]/18 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 min-h-[8.5rem]">
            <div className="flex h-full w-full min-w-0 flex-col justify-center rounded-b-[1.75rem] border-t border-white/20 bg-[#20341f]/72 px-5 py-4 text-primary-foreground shadow-[0_-18px_42px_rgba(6,37,22,0.34)] backdrop-blur-xl backdrop-saturate-150 md:px-6">
              {farmer.role && <p className="btn-label mb-1 text-[0.62rem] uppercase tracking-normal text-accent">{farmer.role}</p>}
              <h3 className="break-words font-heading text-[clamp(1.65rem,7.5vw,2rem)] font-bold leading-none text-primary">
                {farmer.name}
              </h3>
              {farmer.district && (
                <p className="mt-2 text-sm font-semibold leading-snug text-primary/85">{farmer.district} District</p>
              )}
              <span className="mt-3 inline-flex text-sm font-bold text-white transition-colors group-hover:text-accent">
                View profile
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const PartnerLogoItem = ({ partner }: { partner: PartnerLogoRow }) => {
  const logo = useMediaUrl(partner.logo_url);
  const content = (
    <span className="flex w-32 shrink-0 flex-col items-center gap-2 md:w-36">
      <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-primary/10 bg-white p-1 shadow-[10px_10px_24px_hsl(var(--clay-shadow-outer)/0.18),-10px_-10px_24px_hsl(0_0%_100%/0.96)] md:h-28 md:w-28">
        {logo ? (
          <SiteImage src={logo} alt={`${partner.name} logo`} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-tertiary text-center font-heading text-base font-bold leading-tight text-primary">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <span className="max-w-full truncate text-center text-xs font-semibold text-primary/80">
        {partner.name}
      </span>
    </span>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noreferrer" aria-label={partner.name}>
        {content}
      </a>
    );
  }

  return content;
};

const uniquePartnerLogos = (partners: PartnerLogoRow[]) =>
  partners.filter((partner, index, list) => {
    const key = `${partner.name.trim().toLowerCase()}|${partner.logo_url ?? ""}`;
    return list.findIndex((item) => `${item.name.trim().toLowerCase()}|${item.logo_url ?? ""}` === key) === index;
  });

const Index = () => {
  const { data: farmers = [] } = useFarmers();
  const { data: partners } = usePartners();
  const featuredFarmers = farmers.slice(0, 3);
  const partnerSettings = partners?.settings;
  const partnerLogos = uniquePartnerLogos(partners?.logos ?? []);
  const marqueePartners = partnerLogos;

  return (
    <Layout>
      <PageHero
        eyebrow="From Our Farms to the World"
        title="Premium Ugandan"
        titleAccent="Vanilla, Coffee & Cocoa"
        subtitle="Organically grown by 3,000+ farmers on the fertile slopes of Mount Elgon. Exporting quality. Empowering communities."
        image={cropHero.cocoa}
        imageAlt="Open cocoa pod and dried cocoa beans"
        videoSrc={siteVideos.hero}
        size="full"
        bleedTop
      >
        <Link to="/products" className={heroBtn("solid")}>
          Explore Products
        </Link>
        <Link to="/farmers" className={heroBtn("gold")}>
          Meet Our Farmers
        </Link>
      </PageHero>
      <section className="bg-accent text-accent-foreground">
        <div className="container-full py-6 marquee">
          <div className="marquee-content gap-16 pr-16">
            {[...PRINCIPLES, ...PRINCIPLES, ...PRINCIPLES].map((p, i) => (
              <span key={i} className="btn-label text-sm inline-flex items-center">
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="container-full py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4 leading-tight">
            Three crops. One cooperative. One promise.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Organically grown and value added by farmers across Sironko, Bulambuli,
            Mbale, Manafwa, Bududa and Kapchorwa.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((c, i) => (
            <CollectionCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="container-full grid grid-cols-4 gap-3 py-10 text-center sm:gap-6 sm:py-14 md:gap-10 md:py-20">
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
              <p className="mb-1 font-heading text-2xl leading-none text-accent sm:text-4xl md:mb-2 md:text-6xl">{s.n}</p>
              <p className="text-[9px] leading-tight text-primary-foreground/70 sm:text-xs md:text-sm">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="container-full py-20 md:py-28">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-primary">
              Meet the people behind every harvest.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Three featured cooperative members growing organic vanilla, coffee and cocoa
              across the Elgon region.
            </p>
          </div>
          <Link
            to="/farmers"
            className="hidden md:inline-flex btn-label text-xs text-primary hover:text-accent transition-colors items-center link-underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featuredFarmers.map((farmer, i) => (
            <FeaturedFarmerCard key={farmer.id} farmer={farmer} index={i} />
          ))}
        </div>
      </section>
      <section className="bg-muted/40">
        <div className="container-full py-24 md:py-28 grid gap-12 md:grid-cols-3">
          {[
            { title: "Sustainability", body: "Environmentally responsible farming practices, from soil to shipment." },
            { title: "Quality", body: "Unwavering dedication to high-grade vanilla, coffee and cocoa." },
            { title: "Community", body: "Uplifting women, youth and vulnerable groups through training and fair trade." },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <h3 className="min-h-[2rem] font-heading text-2xl text-primary mb-3">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="container-full grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-xl lg:aspect-[4/3]">
          <SiteImage
            src={pageHeroImages.farmers}
            alt="Elgon farmers standing together across the cooperative"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6 leading-tight">
            Women, youth, and communities at the heart of every bean.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We support women and vulnerable groups with organic farming training,
            collective marketing, and profit sharing, building self reliant
            communities across Uganda's Elgon region.
          </p>
          <div className="mb-8 text-primary">
            <span className="btn-label text-xs">3,000+ farmers across 6 districts</span>
          </div>
          <Link
            to="/farmers"
            className="btn-label text-xs inline-flex items-center bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-secondary transition-colors"
          >
            Meet the farmers
          </Link>
        </div>
      </section>
      {partnerLogos.length > 0 && (
        <section className="overflow-hidden bg-muted/40 py-16">
          <div className="container-full">
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <p className="eyebrow mb-3">{partnerSettings?.eyebrow ?? "Partners"}</p>
              <h2 className="font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">
                {partnerSettings?.headline ?? "Working with trusted partners."}
              </h2>
              {partnerSettings?.body && (
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {partnerSettings.body}
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted/40 to-transparent md:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/40 to-transparent md:w-28" />
            <div className="overflow-hidden py-4">
              <div
                className={
                  partnerLogos.length > 1
                    ? "mx-auto flex w-max animate-partner-drift items-center justify-center gap-5"
                    : "mx-auto flex justify-center"
                }
              >
                {marqueePartners.map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className={partnerLogos.length === 1 ? "animate-float" : ""}
                  >
                    <PartnerLogoItem partner={partner} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      <HeroVideoBand
        src={siteVideos.export}
        poster={cropHero.vanilla}
        label="Elgon cooperative export preparation"
        className="md:-mb-24 md:min-h-[calc(76svh+6rem)]"
        videoClassName="object-center brightness-110 contrast-125 saturate-125"
        overlayClassName="bg-none"
      />
    </Layout>
  );
};

export default Index;
