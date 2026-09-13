import { SiteImage } from "@/components/SiteImage";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { logoImage } from "@/data/cropImages";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/farmers", label: "Farmers" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);
      setHidden(currentY > 120 && currentY > lastY && !open);
      lastY = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/70 bg-background/90 backdrop-blur-xl transition-all duration-300",
        scrolled && "shadow-[0_14px_34px_hsl(215_18%_62%/0.22),0_-12px_30px_hsl(0_0%_100%/0.65)]",
        hidden && "-translate-y-full"
      )}
    >
      <nav className="container-full">
        <div className="flex h-16 min-w-0 items-center justify-between gap-3 sm:h-20 md:h-24">
          <Link to="/" className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <SiteImage
              src={logoImage} loading="eager"
              alt="Elgon Vanilla Coffee & Cocoa Growers Cooperative logo"
              width={72} height={72} className="neo-inset h-12 w-12 shrink-0 overflow-hidden rounded-full bg-card object-cover p-0.5 sm:h-16 sm:w-16 md:h-20 md:w-20"
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-heading text-sm text-primary transition-colors group-hover:text-accent sm:text-base md:text-lg">
                Elgon Cooperative
              </span>
              <span className="truncate text-[9px] uppercase text-muted-foreground sm:text-[10px]">
                Vanilla / Coffee / Cocoa
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <RouterNavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "btn-label text-xs transition-colors duration-300 link-underline",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )
                }
              >
                {item.label}
              </RouterNavLink>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/inquire"
              className="neo-button hidden px-5 py-2.5 text-xs btn-label bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Request Quote
            </Link>
            <button
              className="neo-button btn-label bg-card px-3 py-2 text-[11px] hover:text-primary sm:px-4 sm:text-xs lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    Close
                  </motion.div>
                ) : (
                  <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    Menu
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="py-6 space-y-1">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <RouterNavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "block px-3 py-3 btn-label text-sm rounded-sm transition-colors",
                          isActive
                            ? "neo-inset text-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                        )
                      }
                    >
                      {item.label}
                    </RouterNavLink>
                  </motion.div>
                ))}
                <Link
                  to="/inquire"
                  className="neo-button mt-4 block px-5 py-3 text-center text-xs btn-label bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Request Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
