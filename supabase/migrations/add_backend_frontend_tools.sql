-- Migration: Add backend_services and frontend_tools columns to projects table
-- This migration adds support for tracking backend services and frontend tools used in projects

-- Add backend_services column if it doesn't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS backend_services TEXT[] DEFAULT '{}';

-- Add frontend_tools column if it doesn't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS frontend_tools TEXT[] DEFAULT '{}';

-- Create index for better query performance on backend_services
CREATE INDEX IF NOT EXISTS idx_projects_backend_services ON projects USING GIN (backend_services);

-- Create index for better query performance on frontend_tools
CREATE INDEX IF NOT EXISTS idx_projects_frontend_tools ON projects USING GIN (frontend_tools);
