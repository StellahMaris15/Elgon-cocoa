import { forwardRef, useState, type ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { normalizeImageSource } from "@/data/cropImages";
import placeholder from "@/assets/image-placeholder.svg";

type Props = ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string };

/** Keeps failed or missing images from exposing the browser's broken-image UI. */
export const SiteImage = forwardRef<HTMLImageElement, Props>(function SiteImage(
  { src, fallbackSrc, alt = "", loading = "lazy", decoding = "async", onError, srcSet, ...props }, ref,
) {
  const [failed, setFailed] = useState<string[]>([]);
  const original = normalizeImageSource(src);
  const candidates = [original, normalizeImageSource(fallbackSrc), placeholder].filter(Boolean);
  const selected = candidates.find((candidate) => !failed.includes(candidate));
  const isPlaceholder = selected === placeholder;
  return (
    <img
      {...props}
      ref={ref}
      src={selected}
      srcSet={selected === original ? srcSet : undefined}
      alt={isPlaceholder ? (alt ? "Image unavailable: " + alt : "Image unavailable") : alt}
      loading={loading}
      decoding={decoding}
      onError={(event) => {
        if (selected) setFailed((previous) => [...previous, selected]);
        onError?.(event);
      }}
    />
  );
});

export const MotionSiteImage = motion.create(SiteImage);
