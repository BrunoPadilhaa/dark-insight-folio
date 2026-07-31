DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view published projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (published = true);