import { MotionSiteImage } from "@/components/SiteImage";
import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  videoSrc?: string;
  size?: "full" | "compact";
  bleedTop?: boolean;
  mediaVariant?: "default" | "clearMotion" | "clearImage";
  children?: ReactNode;
}

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export const PageHero = ({
  title,
  titleAccent,
  subtitle,
  image,
  imageAlt = "",
  videoSrc,
  size = "compact",
  bleedTop = false,
  mediaVariant = "default",
  children,
}: PageHeroProps) => {
  const reduced = useReducedMotion();
  const clearMotion = mediaVariant === "clearMotion";
  const clearImage = mediaVariant === "clearImage";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-primary text-primary-foreground",
        bleedTop && "-mt-16 md:-mt-20",
        size === "full"
          ? "min-h-[82svh] md:min-h-[86svh] flex items-center"
          : "min-h-[46svh] md:min-h-[54svh] flex items-center"
      )}
    >
      <div className="absolute inset-0 -z-10">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={image}
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <MotionSiteImage
            src={image}
            alt={imageAlt}
            aria-hidden={imageAlt ? undefined : true}
            loading="eager"
            fetchPriority="high"
            initial={reduced ? { scale: 1 } : { scale: clearMotion ? 1.08 : 1.12, x: 0, y: 0 }}
            animate={
              reduced
                ? { scale: 1 }
                : clearMotion
                  ? { scale: [1.08, 1.14, 1.08], x: ["0%", "-1.8%", "0%"], y: ["0%", "1.2%", "0%"] }
                  : { scale: 1 }
            }
            transition={
              clearMotion && !reduced
                ? { duration: 24, ease: "easeInOut", repeat: Infinity }
                : { duration: 12, ease: "linear" }
            }
            className="w-full h-full object-cover object-center transform-gpu will-change-transform"
          />
        )}
        <div
          className={cn(
            "absolute inset-0",
            clearImage
              ? "bg-[linear-gradient(90deg,hsl(221_39%_11%/0.42)_0%,hsl(221_39%_11%/0.24)_36%,hsl(221_39%_11%/0.06)_68%,transparent_100%)]"
              : clearMotion
              ? "bg-[linear-gradient(90deg,hsl(221_39%_11%/0.46)_0%,hsl(221_39%_11%/0.26)_36%,hsl(221_39%_11%/0.07)_68%,transparent_100%)]"
              : "bg-[linear-gradient(90deg,hsl(221_39%_11%/0.50)_0%,hsl(221_39%_11%/0.30)_36%,hsl(221_39%_11%/0.08)_68%,transparent_100%)]"
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            clearImage
              ? "bg-[linear-gradient(180deg,hsl(221_39%_11%/0.10)_0%,transparent_52%,hsl(221_39%_11%/0.06)_100%)]"
              : clearMotion
              ? "bg-[linear-gradient(180deg,hsl(221_39%_11%/0.12)_0%,transparent_52%,hsl(221_39%_11%/0.06)_100%)]"
              : "bg-[linear-gradient(180deg,hsl(221_39%_11%/0.16)_0%,transparent_52%,hsl(221_39%_11%/0.08)_100%)]"
          )}
        />
      </div>

      <div
        className={cn(
          "relative container-full w-full",
          size === "full" ? "pt-28 pb-16 md:pt-36 md:pb-24" : "pt-24 pb-16 md:pt-28 md:pb-20"
        )}
      >
        <motion.h1
          {...fade(0)}
          className={cn(
            "font-heading font-extrabold text-primary-foreground max-w-[15ch] text-balance",
            size === "full"
              ? "text-[2.75rem] leading-[0.98] sm:text-6xl md:text-7xl lg:text-8xl"
              : "text-[2.35rem] leading-[1.02] sm:text-5xl md:text-6xl"
          )}
        >
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-accent">{titleAccent}</span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            {...fade(0.12)}
            className="mt-6 md:mt-8 max-w-xl md:max-w-2xl text-base md:text-lg text-primary-foreground/88 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div {...fade(0.22)} className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const heroBtn = (variant: "solid" | "gold" | "ghost" = "solid") =>
  cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 sm:px-7 py-3.5 btn-label text-xs sm:text-[13px]",
    "transition-all duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
    variant === "solid" &&
      "bg-primary text-primary-foreground border border-primary-foreground/15 shadow-lg shadow-black/25 hover:bg-[hsl(var(--dark-green))]",
    variant === "gold" &&
      "bg-accent text-accent-foreground shadow-lg shadow-black/25 hover:bg-accent/90",
    variant === "ghost" &&
      "border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
  );
