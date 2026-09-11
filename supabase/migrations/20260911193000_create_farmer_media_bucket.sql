INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'farmer-media',
  'farmer-media',
  false,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public read farmer media" ON storage.objects;
CREATE POLICY "public read farmer media" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'farmer-media');

DROP POLICY IF EXISTS "admins insert farmer media" ON storage.objects;
CREATE POLICY "admins insert farmer media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'farmer-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "admins update farmer media" ON storage.objects;
CREATE POLICY "admins update farmer media" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'farmer-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'farmer-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "admins delete farmer media" ON storage.objects;
CREATE POLICY "admins delete farmer media" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'farmer-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
