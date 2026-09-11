import { SiteImage, MotionSiteImage } from "@/components/SiteImage";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { normalizeImageSource } from "@/data/cropImages";
import placeholder from "@/assets/image-placeholder.svg";
import { cn } from "@/lib/utils";

interface Props { images: string[]; name: string; fallbackSrc?: string }

export const ProductGallery = ({ images, name, fallbackSrc }: Props) => {
  const sources = [...new Set(images.map(normalizeImageSource).filter(Boolean))];
  if (!sources.length) sources.push(fallbackSrc || placeholder);
  const [selected, setSelected] = useState<string>();
  const active = Math.max(0, sources.indexOf(selected ?? ""));
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted/40 shadow-sm">
        <AnimatePresence mode="wait">
          <MotionSiteImage
            key={sources[active]}
            src={sources[active]}
            fallbackSrc={fallbackSrc}
            alt={name + " ? view " + (active + 1) + " of " + sources.length}
            loading="eager"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </AnimatePresence>
        {sources.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[11px] btn-label">
            {active + 1} / {sources.length}
          </span>
        )}
      </div>
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
