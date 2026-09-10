import { SiteImage } from "@/components/SiteImage";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Leaf, GraduationCap, Handshake, ArrowRight, MapPin, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";

import { Seo } from "@/components/Seo";
import { useFarmers, type FarmerRow } from "@/hooks/useCatalog";
import { cropHero } from "@/data/cropImages";
import { useMediaUrl } from "@/lib/media";

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
  `btn-label text-[11px] px-4 py-2 rounded-full border capitalize transition-colors ${
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
      className="group bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col hover:border-primary/35 hover:shadow-xl transition-all"
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {photo ? (
          <SiteImage
            src={photo}
            alt={`${farmer.name}, ${farmer.role} in ${farmer.district}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-secondary text-secondary-foreground">
            <span className="font-heading font-bold text-4xl">{initials(farmer.name)}</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-heading font-semibold text-xl text-primary">{farmer.name}</h3>
        {farmer.role && <p className="btn-label text-[11px] text-accent mt-1">{farmer.role}</p>}
        {farmer.district && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
            <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden /> {farmer.district} District
          </p>
        )}
        {(farmer.crops?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {farmer.crops.map((c) => (
              <span key={c} className="btn-label text-[10px] px-3 py-1 rounded-sm bg-muted text-primary capitalize">{c}</span>
            ))}
          </div>
        )}
        {farmer.story && (
          <p className="text-sm text-foreground/80 leading-relaxed mt-4 line-clamp-4">{farmer.story}</p>
        )}
        <Link
          to={`/farmers/${farmer.slug ?? farmer.id}`}
          className="btn-label text-[11px] text-primary hover:text-accent inline-flex items-center gap-2 mt-6 transition-colors"
        >
          View profile <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </div>
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
        subtitle="Elgon Vanilla, Coffee & Cocoa Growers' Cooperative is powered by over 3,000 organic farmers - mostly women - across seven districts of the Elgon region."
        image={cropHero.vanilla}
        imageAlt="Cured vanilla beans bundled on natural linen"
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
        <div className="border border-border rounded-lg p-5 mb-10 bg-card shadow-sm">
          <label className="relative block mb-5">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" aria-hidden />
            <span className="sr-only">Search farmers</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, district or crop..."
              className="w-full h-12 pl-11 pr-4 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
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
                className="w-full h-11 px-3 rounded-sm border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
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

          <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {results.length} {results.length === 1 ? "farmer" : "farmers"} shown
            </p>
            {filtered && (
              <button onClick={clear} className="btn-label text-[11px] inline-flex items-center gap-2 text-primary hover:text-accent transition-colors">
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 rounded-sm border border-border bg-muted/40 animate-pulse" />
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
                className="btn-label text-xs px-5 py-3 rounded-sm border border-border bg-card"
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
            { icon: Leaf, title: "Organic training", body: "Best-practice organic farming for vanilla, coffee and cocoa." },
            { icon: Handshake, title: "Collective marketing", body: "Fair prices through pooled harvests and shared export channels." },
            { icon: GraduationCap, title: "Sustainability skills", body: "On-farm visits and continuous training on productivity." },
            { icon: Users, title: "Community focus", body: "Women, youth and vulnerable groups at the center." },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-card border border-border rounded-sm"
            >
              <v.icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-heading font-semibold text-lg text-primary mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sustainability plan */}
      <section className="bg-muted/40">
        <div className="container-full py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
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
                production and productivity year over year - while collective marketing
                secures fair returns.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SiteImage
              src={cropHero.cocoa}
              alt="Open cocoa pod and dried cocoa beans"
              loading="lazy"
              className="col-span-2 aspect-[16/9] w-full object-cover rounded-sm"
            />
            <SiteImage
              src={cropHero.vanilla}
              alt="Cured vanilla beans bundled on natural linen"
              loading="lazy"
              className="aspect-square w-full object-cover rounded-sm"
            />
            <SiteImage
              src={cropHero.coffee}
              alt="Green and roasted coffee beans spilling from a burlap sack"
              loading="lazy"
              className="aspect-square w-full object-cover rounded-sm"
            />
          </div>
        </div>
      </section>

      
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-full py-20 text-center">
          <p className="eyebrow text-accent mb-4">Farmers</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 max-w-3xl mx-auto">
            Join the cooperative.
          </h2>
          <p className="text-secondary-foreground/80 max-w-xl mx-auto mb-8">
            Are you a smallholder farmer in the Elgon region growing vanilla, coffee
            or cocoa? Get in touch to learn about membership.
          </p>
          <Link
            to="/contact"
            className="btn-label text-xs inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full hover:bg-accent/90 transition-colors"
          >
            Contact the cooperative <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Farmers;
