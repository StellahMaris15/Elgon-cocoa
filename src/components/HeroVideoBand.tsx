import { cn } from "@/lib/utils";

interface HeroVideoBandProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
}

export const HeroVideoBand = ({ src, poster, label, className, videoClassName, overlayClassName }: HeroVideoBandProps) => (
  <section
    className={cn(
      "relative h-[clamp(24rem,86svh,44rem)] w-full overflow-hidden bg-[#04051c] sm:aspect-video sm:h-auto md:min-h-[72svh] md:max-h-none",
      className,
    )}
  >
    <video
      className={cn("absolute inset-0 h-full w-full object-cover object-center", videoClassName)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
    <div
      className={cn(
        "absolute inset-0 bg-[linear-gradient(180deg,hsl(221_39%_11%/0.04)_0%,transparent_58%,hsl(var(--primary)/0.12)_100%)]",
        overlayClassName,
      )}
    />
  </section>
);
