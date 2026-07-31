DROP POLICY IF EXISTS "Admins can update certification badges" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete certification badges" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload certification badges" ON storage.objects;

CREATE POLICY "Admins can upload certification badges"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'certification-badges' AND auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "Admins can update certification badges"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'certification-badges' AND auth.role() = 'authenticated' AND public.is_admin())
WITH CHECK (bucket_id = 'certification-badges' AND auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "Admins can delete certification badges"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'certification-badges' AND auth.role() = 'authenticated' AND public.is_admin());