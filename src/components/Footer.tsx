import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { logoImage } from "@/data/cropImages";

export const Footer = () => {
  return (
    <footer className="relative z-10 block w-full bg-[#013220] text-primary-foreground shadow-[0_-12px_40px_rgba(0,0,0,0.22)]">
      <div className="container-full py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <SiteImage
                src={logoImage} loading="eager"
                alt="Elgon Vanilla Coffee & Cocoa Growers Cooperative logo"
                width={56} height={56} className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary-foreground/95 object-cover p-0.5"
              />
              <span className="font-heading text-lg">Elgon Cooperative</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-md">
              Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society -
              13+ years building sustainable farming skills and cohesive,
              self reliant communities across Uganda's Elgon region.
            </p>
          </div>

          <div>
            <h4 className="eyebrow text-accent mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/products", label: "Products" },
                { to: "/farmers", label: "Farmers" },
                { to: "/contact", label: "Contact" },
                { to: "/inquire", label: "Request Quote" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-accent mb-5">Contact</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li>
                <span>
                  P.O. Box 771, Mbale, Uganda<br />
                  Bilinda Village, Bumateba Parish,<br />
                  Sironko District
                </span>
              </li>
              <li>
                <div className="space-y-0.5">
                  <a href="tel:+256782528476" className="block hover:text-accent transition-colors">+256 782 528 476</a>
                  <a href="tel:+256706613980" className="block hover:text-accent transition-colors">+256 706 613 980</a>
                </div>
              </li>
              <li>
                <a href="mailto:elgonvanillacoffee@gmail.com" className="hover:text-accent transition-colors break-all">
                  elgonvanillacoffee@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-full flex flex-col items-center gap-2 py-6 text-center lg:hidden">
          <p className="text-[10px] leading-tight text-primary-foreground/50 sm:text-xs">
            Copyright {new Date().getFullYear()} Elgon Cooperative. All rights reserved.
          </p>
          <p className="text-[10px] leading-tight text-primary-foreground/50 sm:text-xs">
            <Link
              to="/auth"
              className="font-semibold text-accent transition-colors hover:text-primary-foreground"
            >
              Admin
            </Link>
            <span className="mx-2">|</span>
            <span>Developed By </span>
            <a
              href="https://ritebyte-technologies.im/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent transition-colors hover:text-primary-foreground"
            >
              Ritebyte Technologies Limited
            </a>
          </p>
        </div>
        <div className="container-full hidden items-center justify-between gap-8 py-6 lg:flex">
          <p className="text-xs leading-tight text-primary-foreground/50">
            Developed By{" "}
            <a
              href="https://ritebyte-technologies.im/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent transition-colors hover:text-primary-foreground"
            >
              Ritebyte Technologies Limited
            </a>
          </p>
          <p className="text-xs leading-tight text-primary-foreground/50">
            Copyright {new Date().getFullYear()} Elgon Cooperative. All rights reserved.{" "}
            <Link
              to="/auth"
              className="font-semibold text-accent transition-colors hover:text-primary-foreground"
            >
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
