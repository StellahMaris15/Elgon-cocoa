import { cropImages, cropHero } from "@/data/cropImages";

export type CategorySlug = "vanilla" | "coffee" | "cocoa";

export interface Category {
  id: CategorySlug;
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accentColor: string; // hsl var name
}

export interface ProductVariant {
  name: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  category: CategorySlug;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  origin: string;
  grades: string[];
  variants: ProductVariant[];
  capacity: string;
  images: string[];
  featured?: boolean;
}

export const categories: Category[] = [
  {
    id: "vanilla",
    slug: "vanilla",
    name: "Vanilla",
    tagline: "Aromatic. Organically grown. Exported worldwide.",
    description:
      "Uganda vanilla has a bold, earthy taste with hints of figs and raisins, and one of the highest vanillin contents in the world.",
    image: cropHero.vanilla,
    accentColor: "accent",
  },
  {
    id: "coffee",
    slug: "coffee",
    name: "Coffee",
    tagline: "Expertly grown. Responsibly sourced. Globally cherished.",
    description:
      "Uganda coffee is ranked 2nd in Africa. We focus on Arabica - smooth, sweet, with flavor notes of chocolate and berries.",
    image: cropHero.coffee,
    accentColor: "primary",
  },
  {
    id: "cocoa",
    slug: "cocoa",
    name: "Cocoa",
    tagline: "Richly flavored. Sustainably farmed. Elgon-grown.",
    description:
      "The Elgon region's rainy, shaded tropical climate produces some of the finest cocoa beans in the world.",
    image: cropHero.cocoa,
    accentColor: "secondary",
  },
];

export const products: Product[] = [
  {
    id: "vanilla-cured-beans",
    slug: "vanilla-cured-beans",
    category: "vanilla",
    name: "Cured Vanilla Beans",
    tagline: "Grade A Ugandan vanilla, hand-cured for peak vanillin.",
    shortDescription:
      "Long, oily, aromatic pods cured through our traditional sweat-and-dry process.",
    description:
      "Our cured vanilla beans are hand-harvested at peak maturity by 3,000+ smallholder farmers across the Elgon region, then sorted, blanched, sweated, and slow-dried in our curing houses. The result is a plump, oily, deeply aromatic pod with a bold earthy profile and hints of fig and raisin - the signature of Ugandan vanilla.",
    origin: "Sironko, Bulambuli, Mbale, Manafwa, Bududa, Kapchorwa districts",
    grades: ["Grade A (Gourmet)", "Grade B (Extract)", "Cuts"],
    variants: [
      { name: "Vanilla Oil", description: "Cold-pressed, food & cosmetic grade" },
      { name: "Vanilla Powder", description: "Ground cured beans, no additives" },
      { name: "Vanilla Paste", description: "Seed-flecked, ready to use" },
      { name: "Vanilla Extract (liquid)", description: "Traditional cold extraction" },
    ],
    capacity: "100 tons per season",
    images: [...cropImages.vanilla],
    featured: true,
  },
  {
    id: "arabica-green-beans",
    slug: "arabica-green-beans",
    category: "coffee",
    name: "Arabica Green Beans",
    tagline: "Clean, screened Arabica from the slopes of Mt. Elgon.",
    shortDescription:
      "Washed and sun-dried Arabica in export-ready grades, smooth with notes of chocolate and berries.",
    description:
      "Grown at 1,500-2,300m on the volcanic slopes of Mt. Elgon, our Arabica is wet-processed at farmer washing stations, sun-dried on raised beds, and hulled and screened at our central store. Cup profile: bright acidity, medium body, chocolate and dried-berry finish.",
    origin: "Mt. Elgon slopes - Sironko, Bulambuli, Kapchorwa",
    grades: ["Screen 18+", "Screen 15/16", "Screen 12/14"],
    variants: [
      { name: "Washed Arabica", description: "Fully washed, sun-dried" },
      { name: "Natural Arabica", description: "Sun-dried in cherry" },
    ],
    capacity: "Container-scale (19.2t MOQ); multi-container per season",
    images: [...cropImages.coffee],
    featured: true,
  },
  {
    id: "cocoa-beans",
    slug: "cocoa-beans",
    category: "cocoa",
    name: "Fermented Cocoa Beans",
    tagline: "Elgon-grown, box-fermented, sun-dried.",
    shortDescription:
      "Well-fermented, sun-dried cocoa beans ready for chocolate makers and processors.",
    description:
      "Cocoa from the shaded, rainy Elgon foothills is fermented for 6-7 days in wooden boxes and slow sun-dried on raised platforms. Beans are sorted, moisture-tested, and bagged in jute for export. Ideal for craft and industrial chocolate.",
    origin: "Bududa, Manafwa, Mbale lowlands",
    grades: ["Grade I", "Grade II"],
    variants: [
      { name: "Cocoa Butter", description: "Cold-pressed, small-batch" },
      { name: "Cocoa Powder", description: "Natural, unsweetened" },
      { name: "Cocoa Shells", description: "For teas and mulch" },
    ],
    capacity: "Multi-ton per season; container-scale available",
    images: [...cropImages.cocoa],
    featured: true,
  },
];

export const getProductsByCategory = (slug: CategorySlug) =>
  products.filter((p) => p.category === slug);
export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
