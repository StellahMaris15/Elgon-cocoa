ALTER TABLE public.farmers
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS crops text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS backdrop_vanilla text,
  ADD COLUMN IF NOT EXISTS backdrop_coffee text,
  ADD COLUMN IF NOT EXISTS backdrop_cocoa text;

UPDATE public.farmers
SET slug = regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g') || '-' || left(id::text, 6)
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS farmers_slug_key ON public.farmers (slug);