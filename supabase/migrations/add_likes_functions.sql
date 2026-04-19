-- Functions for likes functionality
CREATE OR REPLACE FUNCTION increment_likes(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_likes_count INTEGER;
BEGIN
    UPDATE projects
    SET likes_count = likes_count + 1
    WHERE id = p_project_id
    RETURNING likes_count INTO v_likes_count;
    
    RETURN v_likes_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_likes_count INTEGER;
BEGIN
    UPDATE projects
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = p_project_id
    RETURNING likes_count INTO v_likes_count;
    
    RETURN v_likes_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
