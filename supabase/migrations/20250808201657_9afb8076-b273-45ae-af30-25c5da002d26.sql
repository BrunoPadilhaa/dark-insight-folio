-- Add has_details and details_content columns to projects table
ALTER TABLE public.projects 
ADD COLUMN has_details BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN details_content TEXT,
ADD COLUMN details_images TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.projects.has_details IS 'Whether this project has a detailed explanation page';
COMMENT ON COLUMN public.projects.details_content IS 'Detailed explanation content for the project';
COMMENT ON COLUMN public.projects.details_images IS 'Array of image URLs for the project details';