DROP POLICY IF EXISTS "Public can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can list certification badges" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can list project images" ON storage.objects;

CREATE POLICY "Admins can list resumes"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'resumes' AND public.is_admin());

CREATE POLICY "Admins can list certification badges"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'certification-badges' AND public.is_admin());

CREATE POLICY "Admins can list project images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-images' AND public.is_admin());