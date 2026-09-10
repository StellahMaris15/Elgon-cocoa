import { SiteImage } from "@/components/SiteImage";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone, Sprout } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Product3DViewer } from "@/components/Product3DViewer";
import { useFarmer } from "@/hooks/useCatalog";
import { useMediaUrl } from "@/lib/media";
import type { CategorySlug } from "@/data/products";

const CropViewer = ({ crop, value, name }: { crop: CategorySlug; value?: string | null; name: string }) => {
  const backdrop = useMediaUrl(value);
  return <Product3DViewer category={crop} name={`${name} — ${crop}`} backdrop={backdrop || undefined} />;
};

const FarmerPortrait = ({ src, alt }: { src?: string | null; alt: string }) => {
  const url = useMediaUrl(src);
  if (!url) {
    return (
      <div className="w-full aspect-[4/5] rounded-sm bg-secondary text-secondary-foreground grid place-items-center">
        <Sprout className="w-10 h-10" aria-hidden />
      </div>
    );
  }
  return <SiteImage src={url} alt={alt} className="w-full aspect-[4/5] object-cover rounded-sm" loading="eager" />;
};

const waHref = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("http")) return trimmed;
  return `https://wa.me/${trimmed.replace(/[^0-9]/g, "")}`;
};

const FarmerDetail = () => {
  const { slug } = useParams();
  const { data: farmer, isLoading, isError } = useFarmer(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-full py-32">
          <div className="h-72 rounded-sm bg-muted/40 animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (isError || !farmer) {
    return (
      <Layout>
        <div className="container-full py-32 text-center">
          <h1 className="font-heading font-bold text-3xl text-primary mb-4">Farmer profile not found</h1>
          <p className="text-muted-foreground mb-8">This profile may have been unpublished by the cooperative office.</p>
          <Link to="/farmers" className="btn-label text-xs text-primary hover:text-accent inline-flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all farmers
          </Link>
        </div>
      </Layout>
    );
  }

  const crops = (farmer.crops ?? []) as CategorySlug[];
  const backdrops: Record<CategorySlug, string | null> = {
    vanilla: farmer.backdrop_vanilla,
    coffee: farmer.backdrop_coffee,
    cocoa: farmer.backdrop_cocoa,
  };

  return (
    <Layout>
      <Seo
        title={`${farmer.name} | Elgon Cooperative Farmer`}
        description={(farmer.story || `${farmer.name}, ${farmer.role} in ${farmer.district} District.`).slice(0, 155)}
        path={`/farmers/${farmer.slug ?? farmer.id}`}
      />

      <section className="container-full pt-12 pb-6">
        <Link to="/farmers" className="btn-label text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Farmers
        </Link>
      </section>

      <section className="container-full pb-16 grid gap-12 lg:grid-cols-[360px_1fr] items-start">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <FarmerPortrait src={farmer.photo_url} alt={`${farmer.name}, ${farmer.role}`} />
        </motion.div>

        <div>
          <p className="eyebrow mb-3">Cooperative member</p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary leading-tight">{farmer.name}</h1>
          {farmer.role && <p className="text-lg text-muted-foreground mt-3">{farmer.role}</p>}

          <div className="flex flex-wrap gap-3 mt-6">
            {farmer.district && (
              <span className="btn-label text-[11px] inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-border">
                <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden /> {farmer.district} District
              </span>
            )}
            {crops.map((c) => (
              <span key={c} className="btn-label text-[11px] px-4 py-2 rounded-sm bg-muted text-primary capitalize">{c}</span>
            ))}
            <span className="btn-label text-[11px] px-4 py-2 rounded-sm bg-accent/15 text-accent-foreground">
              {farmer.published ? "Active member" : "Archived"}
            </span>
          </div>

          {farmer.story && (
            <div className="mt-8 text-base text-foreground/80 leading-relaxed whitespace-pre-line">{farmer.story}</div>
          )}

          <div className="mt-8 border-t border-border pt-6 flex flex-wrap gap-3">
            {farmer.email && (
              <a href={`mailto:${farmer.email}`} className="btn-label text-[11px] inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-primary text-primary-foreground hover:bg-secondary transition-colors">
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            )}
            {farmer.phone && (
              <a href={`tel:${farmer.phone.replace(/\s/g, "")}`} className="btn-label text-[11px] inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-accent" /> {farmer.phone}
              </a>
            )}
            {farmer.whatsapp && (
              <a href={waHref(farmer.whatsapp)} target="_blank" rel="noreferrer" className="btn-label text-[11px] inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
                <MessageCircle className="w-3.5 h-3.5 text-accent" /> WhatsApp
              </a>
            )}
            <Link to="/inquire" className="btn-label text-[11px] inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
              Inquire about their harvest
            </Link>
          </div>
        </div>
      </section>

      {crops.length > 0 && (
        <section className="bg-muted/40">
          <div className="container-full py-20">
            <div className="max-w-2xl mb-10">
              <p className="eyebrow mb-3">3D crop gallery</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
                Explore {farmer.name.split(" ")[0]}'s crops in 3D
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Drag to rotate and scroll to zoom. Each scene uses the backdrop photography
                published for this farmer.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {crops.map((c) => (
                <CropViewer key={c} crop={c} value={backdrops[c]} name={farmer.name} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default FarmerDetail;
