REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "public read published products" ON public.products;
CREATE POLICY "anon read published products" ON public.products FOR SELECT TO anon USING (published);
CREATE POLICY "auth read products" ON public.products FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(),'admin'));

DROP POLICY "public read published farmers" ON public.farmers;
CREATE POLICY "anon read published farmers" ON public.farmers FOR SELECT TO anon USING (published);
CREATE POLICY "auth read farmers" ON public.farmers FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(),'admin'));