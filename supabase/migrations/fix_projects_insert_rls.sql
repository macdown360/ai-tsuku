-- Fix projects INSERT RLS policies to support both authenticated and anonymous posting.
-- This migration removes all existing INSERT policies on projects and recreates
-- role-specific policies to avoid policy drift across environments.

ALTER TABLE public.projects
  ALTER COLUMN user_id DROP NOT NULL;

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'projects'
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.projects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Authenticated users can create projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create projects"
  ON public.projects
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
