-- Create a table for about page content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Public can view about content" 
ON public.about_content 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Authenticated users can manage about content" 
ON public.about_content 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default content
INSERT INTO public.about_content (section, title, subtitle, content) VALUES
('header', 'About Me', 'Passionate about transforming data into strategic business value through innovative analytics solutions and cutting-edge business intelligence tools.', NULL),
('story', NULL, NULL, 'With over <span class="text-primary font-semibold">5 years of experience</span> in Business Intelligence and Data Analytics, I specialize in creating data-driven solutions that empower organizations to make informed decisions.\n\nMy expertise spans from building comprehensive Power BI dashboards to designing scalable data warehouses with dbt. I''m passionate about clean code, efficient processes, and delivering insights that matter.\n\nWhen I''m not working with data, you''ll find me exploring the latest BI tools, contributing to open-source projects, or sharing knowledge with the data community.'),
('skills', 'Technical Skills', NULL, NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_about_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE FUNCTION public.update_about_content_updated_at();