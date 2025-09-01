-- Add published column to projects table
ALTER TABLE public.projects 
ADD COLUMN published boolean NOT NULL DEFAULT true;