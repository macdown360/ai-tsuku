-- Add poster name column to keep display name for anonymous posts
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS poster_name TEXT;

-- Backfill from profiles for existing authenticated posts
UPDATE projects p
SET poster_name = pr.full_name
FROM profiles pr
WHERE p.user_id = pr.id
  AND (p.poster_name IS NULL OR p.poster_name = '');
