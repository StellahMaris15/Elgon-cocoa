import { useEffect } from "react";
import { absoluteAssetUrl, absoluteUrl, DEFAULT_KEYWORDS, SHORT_SITE_NAME } from "@/lib/seo";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product" | "profile";
  keywords?: string[];
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const removeMeta = (attr: "name" | "property", key: string) => {
  document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
};

/** Per-route head metadata + JSON-LD structured data. */
export const Seo = ({
  title,
  description,
  path,
  image,
  type = "website",
  keywords = [],
  noindex = false,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(path);
    const shareImage = absoluteAssetUrl(image);
    const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])].join(", ");

    document.title = title;
    document.documentElement.lang = "en";
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", allKeywords);
    upsertMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    upsertMeta("name", "application-name", SHORT_SITE_NAME);
    upsertMeta("property", "og:site_name", SHORT_SITE_NAME);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", shareImage);
    upsertMeta("property", "og:image:alt", description);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", shareImage);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const scriptId = "route-json-ld";
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById(scriptId)?.remove();
      removeMeta("name", "robots");
    };
  }, [title, description, path, image, type, keywords, noindex, jsonLd]);

  return null;
};
