-- Create admin user for portfolio management
-- Note: This creates the user in the auth.users table with the specified credentials
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'brunopadilha.brp@gmail.com',
  crypt('#Bp129212#', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  FALSE,
  '',
  '',
  '',
  ''
);

-- Update projects table with correct image paths for existing projects
UPDATE projects SET 
  image = '/src/assets/powerbi-dashboard.jpg'
WHERE title LIKE '%Power BI%' OR category = 'power-bi';

UPDATE projects SET 
  image = '/src/assets/dbt-code.jpg'
WHERE title LIKE '%dbt%' OR category = 'dbt';

UPDATE projects SET 
  image = '/src/assets/sql-analysis.jpg'
WHERE title LIKE '%SQL%' OR category = 'sql';