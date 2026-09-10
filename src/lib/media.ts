import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FARMER_BUCKET = "farmer-media";

const cache = new Map<string, string>();

const isDirectUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/") || value.startsWith("data:");

/** Resolves a stored media value (direct URL or storage object path) to a displayable URL. */
export const resolveMedia = async (value?: string | null): Promise<string> => {
  if (!value) return "";
  if (isDirectUrl(value)) return value;
  const cached = cache.get(value);
  if (cached) return cached;
  const { data, error } = await supabase.storage.from(FARMER_BUCKET).createSignedUrl(value, 60 * 60 * 24 * 7);
  if (error || !data?.signedUrl) return "";
  cache.set(value, data.signedUrl);
  return data.signedUrl;
};

/** React hook wrapper around resolveMedia. */
export const useMediaUrl = (value?: string | null) => {
  const [url, setUrl] = useState(() => (value && isDirectUrl(value) ? value : ""));

  useEffect(() => {
    let active = true;
    if (!value) {
      setUrl("");
      return;
    }
    if (isDirectUrl(value)) {
      setUrl(value);
      return;
    }
    resolveMedia(value).then((resolved) => {
      if (active) setUrl(resolved);
    });
    return () => {
      active = false;
    };
  }, [value]);

  return url;
};

/** Uploads a file into the farmer media bucket and returns its storage path. */
export const uploadFarmerMedia = async (file: File, folder: string): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(FARMER_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
};
