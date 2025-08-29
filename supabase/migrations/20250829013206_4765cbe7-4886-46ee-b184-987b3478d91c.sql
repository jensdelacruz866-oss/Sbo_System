-- Fix officers table with correct enum values
UPDATE public.officers 
SET role = 'President' 
WHERE role = 'Vice President';

-- Update other roles to match enum
UPDATE public.officers 
SET role = 'Secretary' 
WHERE role IN ('Secretary', 'Treasurer');