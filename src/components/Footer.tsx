import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { logoImage } from "@/data/cropImages";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container-full py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <SiteImage
                src={logoImage} loading="eager"
                alt="Elgon Vanilla Coffee & Cocoa Growers Cooperative logo"
                width={56} height={56} className="w-14 h-14 shrink-0 object-contain rounded-full bg-primary-foreground/95 p-0.5"
              />
              <span className="font-heading font-bold text-lg">Elgon Cooperative</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-md">
              Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society —
              13+ years building sustainable farming skills and cohesive,
              self-reliant communities across Uganda's Elgon region.
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
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>
                  P.O. Box 771, Mbale — Uganda<br />
                  Bilinda Village, Bumateba Parish,<br />
                  Sironko District
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <div className="space-y-0.5">
                  <a href="tel:+256782528476" className="block hover:text-accent transition-colors">+256 782 528 476</a>
                  <a href="tel:+256706613980" className="block hover:text-accent transition-colors">+256 706 613 980</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <a href="mailto:elgonvanillacoffee@gmail.com" className="hover:text-accent transition-colors break-all">
                  elgonvanillacoffee@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-full py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-xs text-primary-foreground/50">Mbale Industrial City · Uganda</p>
            <Link
              to="/auth"
              className="btn-label text-[11px] border border-primary-foreground/25 text-primary-foreground px-4 py-2 rounded-md hover:border-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              STUDIO
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
