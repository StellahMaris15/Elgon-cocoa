import { cn } from "@/lib/utils";

interface HeroVideoBandProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  overlayClassName?: string;
}

export const HeroVideoBand = ({ src, poster, label, className, overlayClassName }: HeroVideoBandProps) => (
  <section className={cn("relative min-h-[58svh] w-full overflow-hidden bg-primary md:min-h-[72svh]", className)}>
    <video
      className="absolute inset-0 h-full w-full object-cover"
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
