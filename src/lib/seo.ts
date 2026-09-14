import { cropHero, logoImage } from "@/data/cropImages";

export const SITE_NAME = "Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society";
export const SHORT_SITE_NAME = "Elgon Cooperative";
export const DEFAULT_TITLE = "Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society";
export const DEFAULT_DESCRIPTION =
  "Sustainably grown Ugandan vanilla, Arabica coffee and cocoa from the Elgon region, exported worldwide by a cooperative of 3,000+ farmers.";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
export const DEFAULT_KEYWORDS = [
  "Ugandan vanilla",
  "Uganda coffee",
  "Ugandan cocoa",
  "Mount Elgon farmers",
  "organic vanilla exporter",
  "Arabica coffee Uganda",
  "cocoa beans Uganda",
  "farmer cooperative Uganda",
];

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const absoluteUrl = (path = "/") => {
  const origin = SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const cleanPath = path.startsWith("http") ? path : `/${trimSlashes(path)}`;
  if (cleanPath.startsWith("http")) return cleanPath;
  return origin ? `${origin}${cleanPath === "/" ? "" : cleanPath}` : cleanPath;
};

export const absoluteAssetUrl = (asset?: string) => {
  if (!asset) return absoluteUrl(cropHero.cocoa);
  if (/^https?:\/\//i.test(asset)) return asset;
  return absoluteUrl(asset);
};

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: SHORT_SITE_NAME,
  url: absoluteUrl("/"),
  logo: absoluteAssetUrl(logoImage),
  email: "elgonvanillacoffee@gmail.com",
  telephone: ["+256782528476", "+256706613980"],
  address: {
    "@type": "PostalAddress",
    postOfficeBoxNumber: "P.O. Box 771",
    addressLocality: "Mbale",
    addressRegion: "Eastern Region",
    addressCountry: "UG",
  },
  areaServed: ["Uganda", "Global"],
  knowsAbout: ["Vanilla", "Arabica coffee", "Cocoa", "Organic farming", "Agro exports"],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: SHORT_SITE_NAME,
  url: absoluteUrl("/"),
  inLanguage: "en",
  publisher: organizationJsonLd(),
});

export const breadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
