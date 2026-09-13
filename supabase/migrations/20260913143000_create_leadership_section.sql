7890op;/- Admin-managed leadership section for the About page.
CREATE TABLE IF NOT EXISTS public.leadership_settings (
  id boo[[f-
  r=
  f=p{ }op [
     eoulean PRIMARY KEY DEFAULT true CHECK (id),5h
     6jo7
     
     |}+|
     %
     p_settings;
CREATE POLICY "admins manage leadership settings" ON public.leadership_settings
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS leadership_settings_updated_at ON public.leadership_settings;
CREATE TRIGGER leadership_settings_updated_at BEFORE UPDATE ON public.leadership_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.leadership_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  initials text NOT NULL DEFAULT '',
  image_url text,
  whatsapp_number text,
  profile_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.leadership_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leadership_members TO authenticated;
GRANT ALL ON public.leadership_members TO service_role;
ALTER TABLE public.leadership_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published leadership members" ON public.leadership_members;
CREATE POLICY "public read published leadership members" ON public.leadership_members
FOR SELECT TO anon, authenticated
USING (published OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins manage leadership members" ON public.leadership_members;
CREATE POLICY "admins manage leadership members" ON public.leadership_members
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS leadership_members_updated_at ON public.leadership_members;
CREATE TRIGGER leadership_members_updated_at BEFORE UPDATE ON public.leadership_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.leadership_settings (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.partner_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  eyebrow text NOT NULL DEFAULT 'Partners',
  headline text NOT NULL DEFAULT 'Working with trusted partners.',
  body text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.partner_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.partner_settings TO authenticated;
GRANT ALL ON public.partner_settings TO service_role;
ALTER TABLE public.partner_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read partner settings" ON public.partner_settings;
CREATE POLICY "public read partner settings" ON public.partner_settings
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "admins manage partner settings" ON public.partner_settings;
CREATE POLICY "admins manage partner settings" ON public.partner_settings
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS partner_settings_updated_at ON public.partner_settings;
CREATE TRIGGER partner_settings_updated_at BEFORE UPDATE ON public.partner_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.partner_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.partner_logos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_logos TO authenticated;
GRANT ALL ON public.partner_logos TO service_role;
ALTER TABLE public.partner_logos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published partner logos" ON public.partner_logos;
CREATE POLICY "public read published partner logos" ON public.partner_logos
FOR SELECT TO anon, authenticated
USING (published OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins manage partner logos" ON public.partner_logos;
CREATE POLICY "admins manage partner logos" ON public.partner_logos
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS partner_logos_updated_at ON public.partner_logos;
CREATE TRIGGER partner_logos_updated_at BEFORE UPDATE ON public.partner_logos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.partner_settings (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;
