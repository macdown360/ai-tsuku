-- Allow anonymous project submission by making projects.user_id nullable
ALTER TABLE projects
  ALTER COLUMN user_id DROP NOT NULL;

-- Update INSERT policy so authenticated users can post with their own id,
-- and anonymous users can post with user_id = NULL.
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
