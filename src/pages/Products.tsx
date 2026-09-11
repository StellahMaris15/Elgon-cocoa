import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { pageHeroImages } from "@/data/cropImages";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, CategorySlug } from "@/data/products";
import { siteVideos } from "@/data/videos";
import { HeroVideoBand } from "@/components/HeroVideoBand";

import { cn } from "@/lib/utils";

type Filter = "all" | CategorySlug;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = (searchParams.get("category") as Filter) || "all";
  const [filter, setFilter] = useState<Filter>(initial);

  useEffect(() => {
    const p = searchParams.get("category");
    if (p && p !== filter) setFilter(p as Filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter]
  );

  const handleFilter = (f: Filter) => {
    setFilter(f);
    if (f === "all") setSearchParams({});
    else setSearchParams({ category: f });
  };

  return (
    <Layout>
      <PageHero
        eyebrow="From Our Farms to the World"
        title="Vanilla. Coffee."
        titleAccent="Cocoa."
        subtitle="Explore our organically grown, expertly processed exports, available in raw and value added forms, from container scale to bespoke quantities."
        image={pageHeroImages.products}
        imageAlt="Cocoa pods growing on a tree in the Elgon region"
      />

      <section className="container-full py-16">
        <div className="flex flex-wrap gap-3 mb-12">
          {[{ id: "all" as const, label: "All Products" }, ...categories.map((c) => ({ id: c.slug, label: c.name }))].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleFilter(opt.id as Filter)}
              className={cn(
                "btn-label text-xs px-5 py-2.5 rounded-full border transition-all",
                filter === opt.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-muted-foreground">
            No products in this category yet.
          </div>
        )}
      </section>

      <HeroVideoBand
        src={siteVideos.harvest}
        poster={pageHeroImages.products}
        label="Elgon crop harvest and product handling"
        className="-mb-24 md:min-h-[calc(76svh+6rem)]"
        overlayClassName="bg-none"
      />
    </Layout>
  );
};

export default Products;
