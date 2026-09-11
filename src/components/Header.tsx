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
        "sticky top-0 z-50 border-b border-border bg-white transition-all duration-300",
        scrolled && "shadow-[0_12px_32px_hsl(221_39%_11%/0.08)]",
        hidden && "-translate-y-full"
      )}
    >
      <nav className="container-full">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <SiteImage
              src={logoImage} loading="eager"
              alt="Elgon Vanilla Coffee & Cocoa Growers Cooperative logo"
              width={72} height={72} className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0 rounded-full bg-white p-1 shadow-sm"
            />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base md:text-lg text-primary group-hover:text-accent transition-colors">
                Elgon Cooperative
              </span>
              <span className="text-[10px] uppercase text-muted-foreground">
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

          <div className="flex items-center gap-3">
            <Link
              to="/inquire"
              className="hidden sm:inline-flex btn-label text-xs bg-primary text-primary-foreground px-5 py-2.5 rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Request Quote
            </Link>
            <button
              className="lg:hidden btn-label text-xs px-4 py-2 rounded-full border border-border bg-card hover:text-primary transition-colors"
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
                            ? "text-primary bg-muted"
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
                  className="block mt-4 text-center btn-label text-xs bg-primary text-primary-foreground px-5 py-3 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
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
