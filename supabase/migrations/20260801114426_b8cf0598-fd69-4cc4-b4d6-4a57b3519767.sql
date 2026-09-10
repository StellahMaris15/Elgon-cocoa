INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'elgon@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users WHERE email = 'elgon@gmail.com'
ON CONFLICT (id) DO NOTHING;