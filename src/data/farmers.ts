import { cropHero } from "@/data/cropImages";
import type { CategorySlug } from "@/data/products";

export interface StaticFarmer {
  id: string;
  slug: string;
  name: string;
  role: string;
  district: string;
  story: string;
  photo_url: string | null;
  crops: CategorySlug[];
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  backdrop_vanilla: string | null;
  backdrop_coffee: string | null;
  backdrop_cocoa: string | null;
  published: boolean;
  sort_order: number;
}

export const staticFarmers: StaticFarmer[] = [
  {
    id: "stellah-maris",
    slug: "stellah-maris",
    name: "Stellah Maris",
    role: "Organic vanilla and coffee farmer",
    district: "Sironko",
    story:
      "Stellah Maris is part of the Elgon cooperative network of smallholder farmers growing organic crops on the fertile slopes around Mount Elgon. Through the cooperative, her harvest is supported with training, quality handling, and collective market access.",
    photo_url: cropHero.vanilla,
    crops: ["vanilla", "coffee"],
    email: null,
    phone: null,
    whatsapp: null,
    backdrop_vanilla: cropHero.vanilla,
    backdrop_coffee: cropHero.coffee,
    backdrop_cocoa: cropHero.cocoa,
    published: true,
    sort_order: 1,
  },
  {
    id: "grace-namutebi",
    slug: "grace-namutebi",
    name: "Grace Namutebi",
    role: "Organic cocoa farmer",
    district: "Bududa",
    story:
      "Grace grows cocoa with careful post-harvest handling and cooperative support, helping preserve quality from garden to store.",
    photo_url: cropHero.cocoa,
    crops: ["cocoa"],
    email: null,
    phone: null,
    whatsapp: null,
    backdrop_vanilla: cropHero.vanilla,
    backdrop_coffee: cropHero.coffee,
    backdrop_cocoa: cropHero.cocoa,
    published: true,
    sort_order: 2,
  },
  {
    id: "samuel-wandera",
    slug: "samuel-wandera",
    name: "Samuel Wandera",
    role: "Coffee and vanilla farmer",
    district: "Manafwa",
    story:
      "Samuel is part of the cooperative farmer network producing organic coffee and vanilla for consistent, traceable export supply.",
    photo_url: cropHero.coffee,
    crops: ["coffee", "vanilla"],
    email: null,
    phone: null,
    whatsapp: null,
    backdrop_vanilla: cropHero.vanilla,
    backdrop_coffee: cropHero.coffee,
    backdrop_cocoa: cropHero.cocoa,
    published: true,
    sort_order: 3,
  },
];

export const findStaticFarmer = (value?: string | null) => {
  if (!value) return null;
  return staticFarmers.find((farmer) => farmer.slug === value || farmer.id === value) ?? null;
};
