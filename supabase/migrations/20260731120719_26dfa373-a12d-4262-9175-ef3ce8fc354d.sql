DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can update project images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project-images' AND public.is_admin())
WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can upload resumes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resumes' AND public.is_admin());

CREATE POLICY "Admins can update resumes"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'resumes' AND public.is_admin())
WITH CHECK (bucket_id = 'resumes' AND public.is_admin());

CREATE POLICY "Admins can delete resumes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND public.is_admin());