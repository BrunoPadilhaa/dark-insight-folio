-- 1. Certification badges: require admin for write operations
DROP POLICY IF EXISTS "Authenticated users can delete certification badges" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update certification badges" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload certification badges" ON storage.objects;

CREATE POLICY "Admins can delete certification badges"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'certification-badges' AND public.is_admin());

CREATE POLICY "Admins can update certification badges"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'certification-badges' AND public.is_admin())
WITH CHECK (bucket_id = 'certification-badges' AND public.is_admin());

CREATE POLICY "Admins can upload certification badges"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'certification-badges' AND public.is_admin());

-- 2. Stop anonymous listing of bucket contents (public URLs continue to work)
DROP POLICY IF EXISTS "Public can view certification badges" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project images" ON storage.objects;

CREATE POLICY "Authenticated can list certification badges"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'certification-badges');

CREATE POLICY "Authenticated can list project images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-images');

-- 3. Revoke direct EXECUTE on SECURITY DEFINER / trigger functions that must not be callable via the API
REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_about_content_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, public;

-- 4. Remove anon discoverability of user_roles
REVOKE ALL ON public.user_roles FROM anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;