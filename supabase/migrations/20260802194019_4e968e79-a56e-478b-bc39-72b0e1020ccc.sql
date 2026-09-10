CREATE POLICY "public read farmer media" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'farmer-media');

CREATE POLICY "admins insert farmer media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'farmer-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins update farmer media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'farmer-media' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'farmer-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete farmer media" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'farmer-media' AND public.has_role(auth.uid(), 'admin'::app_role));