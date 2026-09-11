import { cropHero } from "@/data/cropImages";
import { SiteImage } from "@/components/SiteImage";
import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Product3DViewer } from "@/components/Product3DViewer";
import { ProductGallery } from "@/components/ProductGallery";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useCatalog";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { slug } = useParams();
  const { products, isLoading } = useProducts();
  const product = slug ? products.find((p) => p.slug === slug) : undefined;
  const [view, setView] = useState<"3d" | "photos">("3d");

  if (isLoading && !product) {
    return (
      <Layout>
        <div className="container-full py-32">
          <div className="h-96 rounded-2xl bg-muted/40 animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!product) return <Navigate to="/products" replace />;

  const category = categories.find((c) => c.id === product.category);
  const categoryProducts = products.filter((p) => p.category === product.category);
  const related = categoryProducts.filter((p) => p.id !== product.id).slice(0, 3);
  // Every image published for this category in the admin dashboard, this product first.
  const galleryImages = Array.from(
    new Set([...product.images, ...categoryProducts.flatMap((p) => p.images)].filter(Boolean)),
  );

  return (
    <Layout>
      <section className="container-full pt-12 pb-6">
        <Link
          to="/products"
          className="btn-label text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
        >
          Back to Products
        </Link>
      </section>

      <section className="container-full pb-14 space-y-4">
        <div
          role="tablist"
          aria-label="Product media view"
          className="inline-flex p-1 rounded-full bg-muted border border-border"
        >
          {([
            { id: "3d", label: "3D Image" },
            { id: "photos", label: "Photos" },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={view === id}
              type="button"
              onClick={() => setView(id)}
              className={cn(
                "btn-label text-xs inline-flex items-center px-4 py-2 rounded-full transition-colors",
                view === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {view === "3d" ? (
          <Product3DViewer category={product.category} name={product.name} />
        ) : (
          <ProductGallery key={product.id} fallbackSrc={cropHero[product.category]} images={galleryImages} name={product.name} />
        )}
      </section>

      <section className="container-full pb-24">
        <div className="max-w-4xl">
          <p className="eyebrow mb-3">{category?.name}</p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{product.tagline}</p>

          <div className="text-base text-foreground/80 leading-relaxed mb-8">
            <p>{product.description}</p>
          </div>


          <div className="space-y-5 border-t border-border pt-6">
            <div>
              <div>
                <p className="btn-label text-xs text-primary mb-1">Origin</p>
                <p className="text-sm text-foreground/80">{product.origin}</p>
              </div>
            </div>
            <div>
              <div>
                <p className="btn-label text-xs text-primary mb-1">Grades</p>
                <p className="text-sm text-foreground/80">{product.grades.join(" / ")}</p>
              </div>
            </div>
            <div>
              <div>
                <p className="btn-label text-xs text-primary mb-1">Capacity</p>
                <p className="text-sm text-foreground/80">{product.capacity}</p>
              </div>
            </div>
          </div>

          {product.variants.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-4">Value Added Forms</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.variants.map((v) => (
                  <div key={v.name} className="flex h-full flex-col p-5 border border-border rounded-2xl bg-card shadow-sm">
                    <p className="min-h-[2.5rem] font-heading font-semibold text-primary text-sm mb-1">{v.name}</p>
                    <p className="text-sm text-foreground/75">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={`/inquire?product=${product.slug}`}
              className="btn-label text-xs bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center"
            >
              Request Quote
            </Link>
            <a
              href="mailto:elgonvanillacoffee@gmail.com"
              className="btn-label text-xs border border-border px-8 py-4 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-muted/40">
          <div className="container-full py-20">
            <p className="eyebrow mb-3">Related</p>
            <h2 className="font-heading font-bold text-3xl text-primary mb-10">More {category?.name}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((p, i) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-muted/40">
                    <SiteImage src={p.images[0]} fallbackSrc={cropHero[p.category]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-3">
                    <h3 className="min-h-[3rem] font-heading font-semibold text-lg text-primary group-hover:text-accent transition-colors">{p.name}</h3>
                    <p className="min-h-[2.75rem] text-sm text-muted-foreground mt-1 line-clamp-2">{p.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
