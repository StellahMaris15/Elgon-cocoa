import vanilla from "@/assets/vanilla-hero.jpg";
import coffee from "@/assets/coffee-hero.jpg";
import cocoa from "@/assets/cocoa-hero.jpg";
import aboutHero from "@/assets/image 1.jpeg";
import farmerHero from "@/assets/herosection Farmer page.jpeg";
import productHero from "@/assets/Herosection Product page.jpeg";

/** Bundled crop photography, available on every deployment. */
export const cropHero = { vanilla, coffee, cocoa } as const;
export const pageHeroImages = { about: aboutHero, farmers: farmerHero, products: productHero } as const;
export const cropImages = { vanilla: [vanilla], coffee: [coffee], cocoa: [cocoa] } as const;
export const logoImage = import.meta.env.BASE_URL + "favicon.png";

/** Older catalog entries may still contain paths from the original asset service. */
export function normalizeImageSource(value?: string | null): string {
  const source = value?.trim() ?? "";
  if (!source.includes("/__l5e/")) return source;
  const filename = source.split("/").pop()?.split(/[?#]/)[0] ?? "";
  if (/^elgon-logo\.png$/i.test(filename)) return logoImage;
  const crop = /^(vanilla|coffee|cocoa)_\d+\.jpg$/i.exec(filename)?.[1].toLowerCase();
  return crop ? cropHero[crop as keyof typeof cropHero] : "";
}

export function productImages(values: unknown, category: string): string[] {
  const images = Array.isArray(values)
    ? [...new Set(values.filter((v): v is string => typeof v === "string").map(normalizeImageSource).filter(Boolean))]
    : [];
  const fallback = cropHero[category as keyof typeof cropHero];
  return images.length ? images : fallback ? [fallback] : [];
}
