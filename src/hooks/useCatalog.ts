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
