-- Create officers table
CREATE TABLE public.officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role app_role NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  term_start DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for officer avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('officer-avatars', 'officer-avatars', true);

-- Storage policies for officer avatars
CREATE POLICY "Officer avatars are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'officer-avatars');

CREATE POLICY "Presidents can upload officer avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'officer-avatars' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'President'
  )
);

CREATE POLICY "Presidents can update officer avatars" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'officer-avatars' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'President'
  )
);

CREATE POLICY "Presidents can delete officer avatars" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'officer-avatars' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'President'
  )
);

-- RLS policies for officers table
CREATE POLICY "Everyone can view officers" 
ON public.officers 
FOR SELECT 
USING (true);

CREATE POLICY "Presidents can manage officers" 
ON public.officers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'President'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'President'
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_officers_updated_at
BEFORE UPDATE ON public.officers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();