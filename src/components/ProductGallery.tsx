import { SiteImage, MotionSiteImage } from "@/components/SiteImage";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { normalizeImageSource } from "@/data/cropImages";
import placeholder from "@/assets/image-placeholder.svg";
import { cn } from "@/lib/utils";

interface Props { images: string[]; name: string; fallbackSrc?: string }

export const ProductGallery = ({ images, name, fallbackSrc }: Props) => {
  const sources = [...new Set(images.map(normalizeImageSource).filter(Boolean))];
  if (!sources.length) sources.push(fallbackSrc || placeholder);
  const [selected, setSelected] = useState<string>();
  const active = Math.max(0, sources.indexOf(selected ?? ""));
  const activeSrc = sources[active];
  return (
    <div>
      <a
        href={activeSrc}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${name} image ${active + 1} in a new tab`}
        className="group relative block h-[clamp(540px,78svh,900px)] cursor-zoom-in overflow-hidden rounded-2xl bg-muted/40 shadow-sm transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <AnimatePresence mode="wait">
          <MotionSiteImage
            key={activeSrc}
            src={activeSrc}
            fallbackSrc={fallbackSrc}
            alt={name + " view " + (active + 1) + " of " + sources.length}
            loading="eager"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </AnimatePresence>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-card/95 px-4 py-2 text-[11px] font-semibold text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <ExternalLink className="h-3.5 w-3.5" />
          Open image
        </span>
        {sources.length > 1 && (
          <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[11px] btn-label">
            {active + 1} / {sources.length}
          </span>
        )}
      </a>
      {sources.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {sources.map((src, i) => (
            <button key={src} type="button" onClick={() => setSelected(src)}
              aria-label={"Show " + name + " image " + (i + 1)} aria-current={i === active}
              className={cn("aspect-square overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", i === active ? "border-accent" : "border-transparent hover:border-border")}
            >
              <SiteImage src={src} fallbackSrc={fallbackSrc} alt={name + " thumbnail " + (i + 1)} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
