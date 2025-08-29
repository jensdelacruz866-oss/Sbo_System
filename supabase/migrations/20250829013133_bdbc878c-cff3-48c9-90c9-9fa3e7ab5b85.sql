-- Create all necessary tables and policies for SBO system

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('President', 'Auditor', 'Secretary');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  student_id TEXT,
  role app_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create officers table
CREATE TABLE IF NOT EXISTS public.officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  term_start DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

-- Create function to sync profile role with user_roles
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.profiles 
  SET role = NEW.role 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS sync_profile_role_trigger ON public.user_roles;
CREATE TRIGGER sync_profile_role_trigger
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_role();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_officers_updated_at ON public.officers;
CREATE TRIGGER update_officers_updated_at
  BEFORE UPDATE ON public.officers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- Create RLS policies for officers
DROP POLICY IF EXISTS "Everyone can view officers" ON public.officers;
CREATE POLICY "Everyone can view officers" 
ON public.officers FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Presidents can manage officers" ON public.officers;
CREATE POLICY "Presidents can manage officers" 
ON public.officers FOR ALL 
USING (public.has_role(auth.uid(), 'President'))
WITH CHECK (public.has_role(auth.uid(), 'President'));

-- Insert sample officers data
INSERT INTO public.officers (name, role, email, bio) VALUES
('Maria Santos', 'President', 'maria.santos@student.edu', 'Dedicated leader with 3 years of student government experience.'),
('Juan Dela Cruz', 'Vice President', 'juan.delacruz@student.edu', 'Passionate advocate for student rights and academic excellence.'),
('Ana Rodriguez', 'Secretary', 'ana.rodriguez@student.edu', 'Detail-oriented organizer ensuring transparent communication.'),
('Carlos Martinez', 'Treasurer', 'carlos.martinez@student.edu', 'Finance expert managing student organization funds responsibly.')
ON CONFLICT DO NOTHING;

-- Create storage bucket for officer avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('officer-avatars', 'officer-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for officer avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'officer-avatars');

DROP POLICY IF EXISTS "Presidents can upload officer avatars" ON storage.objects;
CREATE POLICY "Presidents can upload officer avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'officer-avatars' AND public.has_role(auth.uid(), 'President'));

DROP POLICY IF EXISTS "Presidents can update officer avatars" ON storage.objects;
CREATE POLICY "Presidents can update officer avatars" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'officer-avatars' AND public.has_role(auth.uid(), 'President'));

DROP POLICY IF EXISTS "Presidents can delete officer avatars" ON storage.objects;
CREATE POLICY "Presidents can delete officer avatars" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'officer-avatars' AND public.has_role(auth.uid(), 'President'));