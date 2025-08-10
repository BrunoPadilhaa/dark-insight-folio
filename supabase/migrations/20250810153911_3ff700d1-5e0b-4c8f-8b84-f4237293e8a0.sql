-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date_earned DATE NOT NULL,
  badge_image TEXT,
  verification_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Public can view certifications" 
ON public.certifications 
FOR SELECT 
USING (true);

-- Create policies for authenticated management
CREATE POLICY "Authenticated users can manage certifications" 
ON public.certifications 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for certification badges
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certification-badges', 'certification-badges', true);

-- Create storage policies for certification badges
CREATE POLICY "Public can view certification badges" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certification-badges');

CREATE POLICY "Authenticated users can upload certification badges" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certification-badges');

CREATE POLICY "Authenticated users can update certification badges" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'certification-badges');

CREATE POLICY "Authenticated users can delete certification badges" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'certification-badges');