DROP POLICY IF EXISTS "public read published partner logos" ON public.partner_logos;
DROP POLICY IF EXISTS "anon read published partner logos" ON public.partner_logos;
DROP POLICY IF EXISTS "auth read partner logos" ON public.partner_logos;

CREATE POLICY "anon read published partner logos" ON public.partner_logos
FOR SELECT TO anon
USING (published);

CREATE POLICY "auth read partner logos" ON public.partner_logos
FOR SELECT TO authenticated
USING (published OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "public read published leadership members" ON public.leadership_members;
DROP POLICY IF EXISTS "anon read published leadership members" ON public.leadership_members;
DROP POLICY IF EXISTS "auth read leadership members" ON public.leadership_members;

CREATE POLICY "anon read published leadership members" ON public.leadership_members
FOR SELECT TO anon
USING (published);

CREATE POLICY "auth read leadership members" ON public.leadership_members
FOR SELECT TO authenticated
USING (published OR public.has_role(auth.uid(), 'admin'::public.app_role));
