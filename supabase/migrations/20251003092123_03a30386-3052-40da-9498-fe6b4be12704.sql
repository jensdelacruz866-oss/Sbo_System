-- Add unique constraint on user_id to prevent duplicate role assignments
-- This will allow upsert operations to work correctly
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_key;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);