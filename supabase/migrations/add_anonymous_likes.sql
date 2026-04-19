-- Anonymous-friendly like/unlike via RPC functions
-- These use SECURITY DEFINER to bypass RLS, only incrementing/decrementing by 1

CREATE OR REPLACE FUNCTION increment_likes(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE projects
  SET likes_count = likes_count + 1
  WHERE id = p_project_id
  RETURNING likes_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE projects
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = p_project_id
  RETURNING likes_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
