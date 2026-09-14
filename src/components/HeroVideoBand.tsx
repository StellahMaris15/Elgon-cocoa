import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface HeroVideoBandProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
}

export const HeroVideoBand = ({ src, poster, label, className, videoClassName, overlayClassName }: HeroVideoBandProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden bg-[#04051c] sm:aspect-video md:min-h-[72svh] md:max-h-none",
        className,
      )}
    >
      {shouldLoad ? (
        <video
          className={cn("block h-auto w-full object-contain object-center sm:absolute sm:inset-0 sm:h-full sm:object-cover", videoClassName)}
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
      ) : (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={cn("block h-auto w-full object-contain object-center sm:absolute sm:inset-0 sm:h-full sm:object-cover", videoClassName)}
        />
      )}
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(180deg,hsl(221_39%_11%/0.04)_0%,transparent_58%,hsl(var(--primary)/0.12)_100%)]",
          overlayClassName,
        )}
      />
    </section>
  );
};
