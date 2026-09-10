-- roles
CREATE TYPE public.app_role AS ENUM ('admin','editor','user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profile auto-create
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('vanilla','coffee','cocoa')),
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  origin text NOT NULL DEFAULT '',
  capacity text NOT NULL DEFAULT '',
  grades text[] NOT NULL DEFAULT '{}',
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published products" ON public.products FOR SELECT
  USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- farmers
CREATE TABLE public.farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  story text NOT NULL DEFAULT '',
  photo_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.farmers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farmers TO authenticated;
GRANT ALL ON public.farmers TO service_role;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published farmers" ON public.farmers FOR SELECT
  USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage farmers" ON public.farmers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER farmers_updated_at BEFORE UPDATE ON public.farmers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- inquiries
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  country text,
  email text NOT NULL,
  phone text,
  product_slugs text[] NOT NULL DEFAULT '{}',
  volume text,
  message text,
  source text NOT NULL DEFAULT 'inquire',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','quoted','closed','spam')),
  admin_notes text,
  notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage inquiries" ON public.inquiries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- inquiry settings (single row)
CREATE TABLE public.inquiry_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  notification_emails text[] NOT NULL DEFAULT '{}',
  auto_reply_enabled boolean NOT NULL DEFAULT true,
  auto_reply_subject text NOT NULL DEFAULT 'We received your inquiry',
  auto_reply_body text NOT NULL DEFAULT 'Thank you for contacting Elgon Vanilla, Coffee & Cocoa Growers'' Cooperative Society. Our export team will respond within two business days.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.inquiry_settings TO authenticated;
GRANT ALL ON public.inquiry_settings TO service_role;
ALTER TABLE public.inquiry_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage inquiry settings" ON public.inquiry_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER inquiry_settings_updated_at BEFORE UPDATE ON public.inquiry_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.inquiry_settings (id, notification_emails)
VALUES (true, ARRAY['elgonvanillacoffee@gmail.com']);