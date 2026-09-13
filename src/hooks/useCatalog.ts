import { productImages } from "@/data/cropImages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  products as staticProducts,
  type Product,
  type CategorySlug,
  type ProductVariant,
} from "@/data/products";
import { findStaticFarmer, staticFarmers } from "@/data/farmers";
import farmersPhoto from "@/assets/farmers.jpg";
import harvestedPhoto from "@/assets/harvested.jpg";
import coffeePhoto from "@/assets/coffee.jpg";

export interface FarmerRow {
  id: string;
  slug: string | null;
  name: string;
  role: string;
  district: string;
  story: string;
  photo_url: string | null;
  crops: string[];
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  backdrop_vanilla: string | null;
  backdrop_coffee: string | null;
  backdrop_cocoa: string | null;
  published: boolean;
  sort_order: number;
}

export interface LeadershipSettingsRow {
  eyebrow: string;
  headline: string;
  structure_label: string;
  structure_body: string;
  primary_phone: string;
  secondary_phone: string;
}

export interface LeadershipMemberRow {
  id: string;
  name: string;
  title: string;
  quote: string;
  initials: string;
  image_url: string | null;
  whatsapp_number: string | null;
  profile_url: string | null;
  published: boolean;
  sort_order: number;
}

export interface PartnerSettingsRow {
  eyebrow: string;
  headline: string;
  body: string;
}

export interface PartnerLogoRow {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  published: boolean;
  sort_order: number;
}

const staticLeadershipSettings: LeadershipSettingsRow = {
  eyebrow: "Leadership",
  headline: "Guided by experience.",
  structure_label: "Leadership structure",
  structure_body:
    "Reviewed by the cooperative's Board of Members, with executive oversight across strategy, finance, and operations.",
  primary_phone: "+256 782 528 476",
  secondary_phone: "+256 706 613 980",
};

const staticPartnerSettings: PartnerSettingsRow = {
  eyebrow: "Partners",
  headline: "Working with trusted partners.",
  body: "",
};

const staticLeadershipMembers: LeadershipMemberRow[] = [
  {
    id: "madoi-saphina-mudebo",
    name: "Madoi Saphina Mudebo",
    title: "Managing Director",
    quote: "Leads Elgon cooperative strategy, operations, and farmer-centered development initiatives.",
    initials: "MM",
    image_url: farmersPhoto,
    whatsapp_number: null,
    profile_url: "/about",
    published: true,
    sort_order: 1,
  },
  {
    id: "elgon-executive-director",
    name: "Elgon Cooperative Executive Director",
    title: "Executive Director",
    quote: "Coordinates operations, quality systems, market access, and leadership programs for the Elgon network.",
    initials: "ED",
    image_url: harvestedPhoto,
    whatsapp_number: null,
    profile_url: "/about",
    published: true,
    sort_order: 2,
  },
  {
    id: "elgon-women-youth-lead",
    name: "Elgon Women & Youth Lead",
    title: "Women & Youth Representative",
    quote: "Represents community inclusion, women’s empowerment, youth participation, and farmer livelihood development.",
    initials: "WY",
    image_url: coffeePhoto,
    whatsapp_number: null,
    profile_url: "/about",
    published: true,
    sort_order: 3,
  },
];

const mapProduct = (row: Record<string, unknown>): Product => ({
  id: String(row.id),
  slug: String(row.slug),
  category: row.category as CategorySlug,
  name: String(row.name),
  tagline: String(row.tagline ?? ""),
  shortDescription: String(row.short_description ?? ""),
  description: String(row.description ?? ""),
  origin: String(row.origin ?? ""),
  capacity: String(row.capacity ?? ""),
  grades: (row.grades as string[]) ?? [],
  variants: ((row.variants as ProductVariant[]) ?? []).filter(Boolean),
  images: productImages(row.images, String(row.category)),
  featured: Boolean(row.featured),
});

const isUuid = (value?: string | null) =>
  Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));

/** Live catalog with a static fallback so the site never renders empty. */
export const useProducts = () => {
  const query = useQuery({
    queryKey: ["products", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
    staleTime: 60_000,
    retry: 1,
  });

  const list = query.data && query.data.length > 0 ? query.data : staticProducts;
  return { ...query, products: list };
};

export const useFarmers = () =>
  useQuery({
    queryKey: ["farmers", "public"],
    placeholderData: staticFarmers as FarmerRow[],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("farmers")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data && data.length > 0 ? ((data ?? []) as unknown as FarmerRow[]) : (staticFarmers as FarmerRow[]);
      } catch {
        return staticFarmers as FarmerRow[];
      }
    },
    staleTime: 60_000,
    retry: 1,
  });

/** Single published farmer by slug (falls back to id lookup). */
export const useFarmer = (slug?: string) =>
  useQuery({
    queryKey: ["farmer", slug],
    enabled: Boolean(slug),
    placeholderData: () => findStaticFarmer(slug) as unknown as FarmerRow | null,
    queryFn: async () => {
      try {
        const bySlug = await supabase
          .from("farmers")
          .select("*")
          .eq("slug", slug as string)
          .eq("published", true)
          .maybeSingle();

        if (bySlug.error) throw bySlug.error;
        if (bySlug.data) return bySlug.data as unknown as FarmerRow;

        if (isUuid(slug)) {
          const byId = await supabase
            .from("farmers")
            .select("*")
            .eq("id", slug as string)
            .eq("published", true)
            .maybeSingle();
          if (byId.error) throw byId.error;
          if (byId.data) return byId.data as unknown as FarmerRow;
        }

        return (findStaticFarmer(slug) ?? null) as unknown as FarmerRow | null;
      } catch {
        return findStaticFarmer(slug) as unknown as FarmerRow | null;
      }
    },
    retry: 1,
  });

export const useLeadership = () =>
  useQuery({
    queryKey: ["leadership", "public"],
    placeholderData: {
      settings: staticLeadershipSettings,
      members: [],
    },
    queryFn: async () => {
      try {
        const [settingsResult, membersResult] = await Promise.all([
          supabase.from("leadership_settings").select("*").eq("id", true).maybeSingle(),
          supabase
            .from("leadership_members")
            .select("*")
            .eq("published", true)
            .order("sort_order", { ascending: true }),
        ]);

        if (settingsResult.error) throw settingsResult.error;
        if (membersResult.error) throw membersResult.error;

        const settings = (settingsResult.data ?? staticLeadershipSettings) as unknown as LeadershipSettingsRow;
        const members = ((membersResult.data ?? []) as unknown as LeadershipMemberRow[]);

        return { settings, members };
      } catch {
        return {
          settings: staticLeadershipSettings,
          members: [],
        };
      }
    },
    staleTime: 60_000,
    retry: 1,
  });

export const useLeadershipMember = (id?: string) =>
  useQuery({
    queryKey: ["leadership-member", id],
    enabled: Boolean(id),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("leadership_members")
          .select("*")
          .eq("id", id as string)
          .eq("published", true)
          .maybeSingle();

        if (error) throw error;
        return (data ?? null) as unknown as LeadershipMemberRow | null;
      } catch {
        return null as LeadershipMemberRow | null;
      }
    },
    staleTime: 60_000,
    retry: 1,
  });

export const usePartners = () =>
  useQuery({
    queryKey: ["partners", "public"],
    placeholderData: {
      settings: staticPartnerSettings,
      logos: [],
    },
    queryFn: async () => {
      const logosResult = await supabase
        .from("partner_logos")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (logosResult.error) throw logosResult.error;

      const settingsResult = await supabase.from("partner_settings").select("*").eq("id", true).maybeSingle();
      const settings = (settingsResult.error ? staticPartnerSettings : (settingsResult.data ?? staticPartnerSettings)) as unknown as PartnerSettingsRow;
      const logos = ((logosResult.data ?? []) as unknown as PartnerLogoRow[]);

      return { settings, logos };
    },
    staleTime: 60_000,
    retry: 1,
  });
