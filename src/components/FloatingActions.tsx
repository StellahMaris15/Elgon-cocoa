import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Mail, Phone, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { preloadRoute } from "@/lib/routePrefetch";

const actions = [
  { label: "Request quote", to: "/inquire", icon: Send },
  { label: "Call office", href: "tel:+256782528476", icon: Phone },
  { label: "Email office", href: "mailto:elgonvanillacoffee@gmail.com", icon: Mail },
];

export const FloatingActions = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actionClass =
    "grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-label="Quick actions"
    >
      {actions.map(({ label, to, href, icon: Icon }) =>
        to ? (
          <Link
            key={label}
            to={to}
            className={actionClass}
            aria-label={label}
            title={label}
            onMouseEnter={() => preloadRoute(to)}
            onFocus={() => preloadRoute(to)}
            onTouchStart={() => preloadRoute(to)}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <a key={label} href={href} className={actionClass} aria-label={label} title={label}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        ),
      )}
      <button
        type="button"
        className={actionClass}
        aria-label="Back to top"
        title="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};
