import { MotionSiteImage } from "@/components/SiteImage";
import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  /** Small italic line above the title. */
  eyebrow: string;
  /** Leading part of the headline (rendered in cream). */
  title: string;
  /** Emphasised part of the headline (rendered in gold). */
  titleAccent?: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  /** Full-height treatment for the home page, compact for inner pages. */
  size?: "full" | "compact";
  /** Bleeds under the sticky header (home page only). */
  bleedTop?: boolean;
  children?: ReactNode;
}

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export const PageHero = ({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  image,
  imageAlt = "",
  size = "compact",
  bleedTop = false,
  children,
}: PageHeroProps) => {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-primary text-primary-foreground",
        bleedTop && "-mt-16 md:-mt-20",
        size === "full"
          ? "min-h-[88svh] md:min-h-[92svh] flex items-center"
          : "min-h-[54svh] md:min-h-[62svh] flex items-center"
      )}
    >
      {/* Background photography with a gentle zoom */}
      <div className="absolute inset-0 -z-10">
        <MotionSiteImage
          src={image}
          alt={imageAlt}
          aria-hidden={imageAlt ? undefined : true}
          loading="eager"
          fetchPriority="high"
          initial={{ scale: reduced ? 1 : 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "linear" }}
          className="w-full h-full object-cover object-center"
        />
        {/* Deep green wash anchored to the top-left, photo stays crisp toward the bottom-right */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--primary)/0.85)_0%,hsl(var(--primary)/0.75)_28%,hsl(var(--primary)/0.45)_52%,hsl(var(--primary)/0.2)_78%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--primary)/0.55)_0%,transparent_45%,hsl(var(--primary)/0.25)_100%)]" />
      </div>

      <div
        className={cn(
          "relative container-full w-full",
          size === "full" ? "pt-28 pb-16 md:pt-36 md:pb-24" : "pt-24 pb-16 md:pt-28 md:pb-20"
        )}
      >
        <motion.p
          {...fade(0)}
          className="font-heading italic text-accent text-base md:text-lg tracking-tight mb-4 md:mb-6"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          {...fade(0.08)}
          className={cn(
            "font-heading font-extrabold text-primary-foreground max-w-[16ch] text-balance",
            size === "full"
              ? "text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl lg:text-8xl"
              : "text-[2.2rem] leading-[1.06] sm:text-5xl md:text-6xl lg:text-7xl"
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
            {...fade(0.18)}
            className="mt-6 md:mt-8 max-w-xl md:max-w-2xl text-base md:text-lg text-primary-foreground/85 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div {...fade(0.28)} className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/** Shared hero button styles — solid green or solid gold. */
export const heroBtn = (variant: "solid" | "gold" | "ghost" = "solid") =>
  cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 sm:px-7 py-3.5 btn-label text-xs sm:text-[13px]",
    "transition-all duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
    variant === "solid" &&
      "bg-[hsl(var(--dark-green))] text-primary-foreground border border-primary-foreground/15 shadow-lg shadow-black/25 hover:bg-[hsl(var(--dark-green))]/85",
    variant === "gold" &&
      "bg-accent text-accent-foreground shadow-lg shadow-black/25 hover:bg-accent/90",
    variant === "ghost" &&
      "border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
  );
