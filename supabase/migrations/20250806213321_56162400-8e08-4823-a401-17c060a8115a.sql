-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('power-bi', 'dbt', 'sql')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT,
  link TEXT,
  github TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage projects" 
ON public.projects 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Create policy for public read access
CREATE POLICY "Public can view projects" 
ON public.projects 
FOR SELECT 
TO anon 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing projects from JSON data
INSERT INTO public.projects (title, description, category, tags, image, link, github, featured, display_order)
VALUES 
  ('Sales Performance Dashboard', 'Comprehensive Power BI dashboard analyzing sales performance across regions, products, and time periods with interactive filters and KPI tracking.', 'power-bi', ARRAY['Power BI', 'DAX', 'Sales Analytics', 'KPIs'], '/src/assets/powerbi-dashboard.jpg', 'https://app.powerbi.com/your-dashboard-link', 'https://github.com/yourusername/sales-dashboard', true, 1),
  ('Modern Data Warehouse with dbt', 'End-to-end data transformation pipeline using dbt, implementing dimensional modeling and automated testing for reliable analytics.', 'dbt', ARRAY['dbt', 'Data Modeling', 'ETL', 'Testing'], '/src/assets/dbt-code.jpg', '', 'https://github.com/yourusername/dbt-warehouse', true, 2),
  ('Customer Segmentation Analysis', 'Advanced SQL queries and stored procedures for customer behavior analysis, churn prediction, and lifetime value calculations.', 'sql', ARRAY['SQL', 'PostgreSQL', 'Customer Analytics', 'Segmentation'], '/src/assets/sql-analysis.jpg', '', 'https://github.com/yourusername/customer-analysis', false, 3),
  ('Financial Reporting Suite', 'Automated financial reports with Power BI including P&L statements, budget variance analysis, and cash flow forecasting.', 'power-bi', ARRAY['Power BI', 'Financial Analysis', 'Reporting', 'Automation'], '/src/assets/powerbi-dashboard.jpg', 'https://app.powerbi.com/your-financial-dashboard', '', false, 4),
  ('Incremental Data Processing', 'Optimized dbt models with incremental loading strategies for large datasets, reducing processing time by 75%.', 'dbt', ARRAY['dbt', 'Performance', 'Incremental', 'Optimization'], '/src/assets/dbt-code.jpg', '', 'https://github.com/yourusername/dbt-incremental', false, 5),
  ('Database Performance Optimization', 'Complex query optimization project improving database performance by 60% through indexing strategies and query rewriting.', 'sql', ARRAY['SQL', 'Performance', 'Indexing', 'Optimization'], '/src/assets/sql-analysis.jpg', '', 'https://github.com/yourusername/sql-optimization', true, 6);