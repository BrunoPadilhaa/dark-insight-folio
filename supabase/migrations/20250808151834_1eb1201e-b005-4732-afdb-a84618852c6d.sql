-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Create policies for resume uploads
CREATE POLICY "Authenticated users can upload resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resumes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resumes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');