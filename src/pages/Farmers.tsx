import { SiteImage } from "@/components/SiteImage";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { HeroVideoBand } from "@/components/HeroVideoBand";

import { Seo } from "@/components/Seo";
import { useFarmers, type FarmerRow } from "@/hooks/useCatalog";
import { cropHero, pageHeroImages } from "@/data/cropImages";
import { useMediaUrl } from "@/lib/media";
import { siteVideos } from "@/data/videos";

const DISTRICTS = ["Sironko", "Bulambuli", "Mbale City", "Mbale", "Manafwa", "Bududa", "Kapchorwa"];
const CROPS = ["vanilla", "coffee", "cocoa"];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const chip = (active: boolean) =>
  `btn-label text-[11px] px-3 py-2 sm:px-4 rounded-full border capitalize transition-colors ${
    active ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"
  }`;

const FarmerCard = ({ farmer, index }: { farmer: FarmerRow; index: number }) => {
  const photo = useMediaUrl(farmer.photo_url);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 5) * 0.06 }}
      className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <Link to={`/farmers/${farmer.slug ?? farmer.id}`} className="block h-full">
        <div className="relative aspect-[4/5] min-h-[20rem] overflow-hidden bg-muted sm:min-h-[24rem] md:min-h-[28rem] lg:min-h-[30rem]">
          {photo ? (
            <SiteImage
              src={photo}
              alt={`${farmer.name}, ${farmer.role} in ${farmer.district}`}
              loading="lazy"
              className="h-full w-full object-cover brightness-110 contrast-110 saturate-115 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-secondary text-secondary-foreground">
              <span className="font-heading text-4xl font-bold">{initials(farmer.name)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#062516]/18 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[28%]">
            <div className="flex h-full w-full min-w-0 flex-col justify-center rounded-b-[1.75rem] border-t border-white/25 bg-[#062516]/50 px-4 py-2 text-primary-foreground shadow-2xl shadow-black/20 backdrop-blur-md backdrop-saturate-150 sm:px-5 md:px-6">
              <h3 className="break-words font-heading text-[clamp(1.3rem,7.5vw,1.55rem)] font-semibold leading-none text-primary-foreground drop-shadow-sm md:text-[1.7rem]">
                {farmer.name}
              </h3>
              {farmer.role && <p className="btn-label mt-1 text-[0.62rem] text-accent">{farmer.role}</p>}
              {farmer.district && (
                <p className="mt-1 text-[0.72rem] leading-snug text-primary-foreground/85">
                  {farmer.district} District
                </p>
              )}
              {(farmer.crops?.length ?? 0) > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {farmer.crops.slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className="btn-label rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 text-[0.58rem] capitalize text-primary-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <span className="mt-1.5 inline-flex text-[0.68rem] font-semibold text-accent transition-colors group-hover:text-primary-foreground">
                View profile
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const Farmers = () => {
  const { data: farmers = [], isLoading, isError } = useFarmers();
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("all");
  const [district, setDistrict] = useState("all");
  const [status, setStatus] = useState("all");

  const districts = useMemo(
    () => Array.from(new Set(farmers.map((f) => f.district).filter(Boolean))).sort(),
    [farmers],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farmers.filter((f) => {
      if (crop !== "all" && !(f.crops ?? []).includes(crop)) return false;
      if (district !== "all" && f.district !== district) return false;
      if (status === "active" && !f.published) return false;
      if (status === "archived" && f.published) return false;
      if (!q) return true;
      return [f.name, f.role, f.district, f.story, ...(f.crops ?? [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [farmers, query, crop, district, status]);

  const clear = () => {
    setQuery("");
    setCrop("all");
    setDistrict("all");
    setStatus("all");
  };
  const filtered = query || crop !== "all" || district !== "all" || status !== "all";

  return (
    <Layout>
      <Seo
        title="Our Farmers | Elgon Vanilla, Coffee & Cocoa Cooperative"
        description="Meet the 3,000+ smallholder farmers of the Elgon region growing organic vanilla, coffee and cocoa with the cooperative."
        path="/farmers"
      />

      {/* Hero */}
      <PageHero
        eyebrow="From Our Farms to the World"
        title="3,000+ smallholders."
        titleAccent="One cooperative."
        subtitle="Elgon Vanilla, Coffee & Cocoa Growers' Cooperative is powered by over 3,000 organic farmers, mostly women, across seven districts of the Elgon region."
        image={pageHeroImages.farmers}
        imageAlt="Elgon farmers tending vanilla vines"
        mediaVariant="clearMotion"
      />

      {/* Farmer profiles from the admin dashboard */}
      <section className="container-full py-24">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">Meet the members</p>
          <h2 className="font-heading font-bold text-4xl text-primary">Faces behind every harvest</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Profiles published by the cooperative office. Each member is trained,
            certified organic, and paid through collective marketing.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-10 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <label className="relative block mb-5">
            <span className="sr-only">Search farmers</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, district or crop..."
              className="w-full h-12 px-4 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <span className="btn-label text-[10px] text-primary block mb-2">Crop</span>
              <div className="flex flex-wrap gap-2">
                <button className={chip(crop === "all")} onClick={() => setCrop("all")}>All</button>
                {CROPS.map((c) => (
                  <button key={c} className={chip(crop === c)} onClick={() => setCrop(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="btn-label text-[10px] text-primary block mb-2">Location</span>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-11 px-3 rounded-full border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="btn-label text-[10px] text-primary block mb-2">Status</span>
              <div className="flex flex-wrap gap-2">
                <button className={chip(status === "all")} onClick={() => setStatus("all")}>All</button>
                <button className={chip(status === "active")} onClick={() => setStatus("active")}>Active</button>
                <button className={chip(status === "archived")} onClick={() => setStatus("archived")}>Archived</button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {results.length} {results.length === 1 ? "farmer" : "farmers"} shown
            </p>
            {filtered && (
              <button onClick={clear} className="btn-label text-[11px] inline-flex items-center text-primary hover:text-accent transition-colors">
                Clear filters
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 rounded-2xl border border-border bg-muted/40 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <p className="text-sm text-muted-foreground">
            Farmer profiles could not be loaded right now. Please refresh the page or contact the cooperative office.
          </p>
        )}

        {!isLoading && !isError && farmers.length === 0 && (
          <p className="text-sm text-muted-foreground">No farmer profiles have been published yet.</p>
        )}

        {!isLoading && !isError && farmers.length > 0 && results.length === 0 && (
          <p className="text-sm text-muted-foreground">No farmers match these filters. Try clearing them.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((f, i) => (
            <FarmerCard key={f.id} farmer={f} index={i} />
          ))}
        </div>
      </section>


      {/* Districts */}
      <section className="bg-muted/40">
        <div className="container-full py-24">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">Where we work</p>
            <h2 className="font-heading font-bold text-4xl text-primary">Across the Elgon region</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {DISTRICTS.map((d, i) => (
              <motion.span
                key={d}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="btn-label text-xs px-5 py-3 rounded-full border border-border bg-card"
              >
                {d}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Cooperative's role */}
      <section className="container-full py-24">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow mb-3">The cooperative's role</p>
          <h2 className="font-heading font-bold text-4xl text-primary">Farmer-first, always.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Organic training", body: "Best-practice organic farming for vanilla, coffee and cocoa." },
            { title: "Collective marketing", body: "Fair prices through pooled harvests and shared export channels." },
            { title: "Sustainability skills", body: "On-farm visits and continuous training on productivity." },
            { title: "Community focus", body: "Women, youth and vulnerable groups at the center." },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex h-full flex-col p-6 bg-card border border-border rounded-2xl shadow-sm"
            >
              <h3 className="min-h-[2.75rem] font-heading font-semibold text-lg text-primary mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="container-full pt-24 pb-12">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Sustainability</p>
            <h2 className="font-heading font-bold text-4xl text-primary mb-6 leading-tight">
              From garden to store to global buyer.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Harvests are delivered from farmer gardens to well-equipped cooperative
                stores where beans and pods are sorted, cured, pulped, fermented, dried
                and stored to preserve aroma, form and grade.
              </p>
              <p>
                Continuous farmer training and consistent farm visits have increased
                production and productivity year over year, while collective marketing
                secures fair returns.
              </p>
            </div>
          </div>
        </div>
        <div className="container-full pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            <SiteImage
              src={cropHero.cocoa}
              alt="Open cocoa pod and dried cocoa beans"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover rounded-2xl shadow-sm"
            />
            <SiteImage
              src={cropHero.vanilla}
              alt="Cured vanilla beans bundled on natural linen"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover rounded-2xl shadow-sm"
            />
            <SiteImage
              src={cropHero.coffee}
              alt="Green and roasted coffee beans spilling from a burlap sack"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover rounded-2xl shadow-sm"
            />
          </div>
        </div>
      </section>

      
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-full py-8 md:py-10 text-center">
          <p className="eyebrow text-accent mb-2">Farmers</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-3 max-w-3xl mx-auto">
            Join the cooperative.
          </h2>
          <p className="text-secondary-foreground/80 max-w-xl mx-auto mb-5">
            Are you a smallholder farmer in the Elgon region growing vanilla, coffee
            or cocoa? Get in touch to learn about membership.
          </p>
          <Link
            to="/contact"
            className="btn-label text-xs inline-flex items-center bg-accent text-accent-foreground px-7 py-3.5 rounded-full hover:bg-accent/90 transition-colors"
          >
            Contact the cooperative
          </Link>
        </div>
      </section>

      <HeroVideoBand
        src={siteVideos.farmers}
        poster={pageHeroImages.farmers}
        label="Elgon cooperative farmers working in the fields"
        className="-mb-24 md:min-h-[calc(76svh+6rem)]"
        overlayClassName="bg-none"
      />
    </Layout>
  );
};

export default Farmers;
