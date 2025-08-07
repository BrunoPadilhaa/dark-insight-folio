-- Fix image paths to work properly in production
UPDATE projects SET 
  image = 'src/assets/powerbi-dashboard.jpg'
WHERE image = '/src/assets/powerbi-dashboard.jpg';

UPDATE projects SET 
  image = 'src/assets/dbt-code.jpg'
WHERE image = '/src/assets/dbt-code.jpg';

UPDATE projects SET 
  image = 'src/assets/sql-analysis.jpg'
WHERE image = '/src/assets/sql-analysis.jpg';