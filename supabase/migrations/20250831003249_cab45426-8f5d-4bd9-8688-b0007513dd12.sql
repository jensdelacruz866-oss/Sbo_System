-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('President', 'Secretary', 'Auditor');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create budget allocations table
CREATE TABLE public.budget_allocations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  category text NOT NULL,
  allocated_amount numeric NOT NULL DEFAULT 0,
  fiscal_year integer NOT NULL DEFAULT EXTRACT(year FROM now()),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

-- Enable RLS on budget_allocations
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;

-- Create expenses table
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  description text,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  receipt_url text,
  event_id uuid,
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create events table
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time,
  location text,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create announcements table
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create documents table
CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size bigint,
  category text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

-- Enable RLS on documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create officers table
CREATE TABLE public.officers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  email text NOT NULL,
  bio text,
  avatar_url text,
  term_start date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

-- Enable RLS on officers
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Create audit log function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action text,
  p_table_name text,
  p_record_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (auth.uid(), p_action, p_table_name, p_record_id, p_old_values, p_new_values);
END;
$$;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger function to sync profile role
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = NEW.role 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_budget_allocations_updated_at
  BEFORE UPDATE ON public.budget_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_officers_updated_at
  BEFORE UPDATE ON public.officers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to sync profile role when user_roles changes
CREATE TRIGGER sync_profile_role_trigger
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for budget_allocations
CREATE POLICY "All authenticated users can view budget allocations"
  ON public.budget_allocations
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Presidents can manage budget allocations"
  ON public.budget_allocations
  FOR ALL
  USING (has_role(auth.uid(), 'President'));

-- RLS Policies for expenses
CREATE POLICY "All authenticated users can view expenses"
  ON public.expenses
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Secretaries can insert expenses"
  ON public.expenses
  FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'Secretary') OR has_role(auth.uid(), 'President')
    AND auth.uid() = created_by
  );

CREATE POLICY "Presidents can manage all expenses"
  ON public.expenses
  FOR ALL
  USING (has_role(auth.uid(), 'President'));

CREATE POLICY "Auditors can view all expenses"
  ON public.expenses
  FOR SELECT
  USING (has_role(auth.uid(), 'Auditor'));

-- RLS Policies for events
CREATE POLICY "All authenticated users can view public events"
  ON public.events
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      is_public = true OR 
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

CREATE POLICY "Presidents and Secretaries can manage events"
  ON public.events
  FOR ALL
  USING (has_role(auth.uid(), 'President') OR has_role(auth.uid(), 'Secretary'));

-- RLS Policies for announcements
CREATE POLICY "All authenticated users can view public announcements"
  ON public.announcements
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      is_public = true OR 
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

CREATE POLICY "Presidents and Secretaries can manage announcements"
  ON public.announcements
  FOR ALL
  USING (has_role(auth.uid(), 'President') OR has_role(auth.uid(), 'Secretary'));

-- RLS Policies for documents
CREATE POLICY "All roles can manage documents"
  ON public.documents
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND (
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

-- RLS Policies for officers
CREATE POLICY "Everyone can view officers"
  ON public.officers
  FOR SELECT
  USING (true);

CREATE POLICY "Presidents can manage officers"
  ON public.officers
  FOR ALL
  USING (has_role(auth.uid(), 'President'))
  WITH CHECK (has_role(auth.uid(), 'President'));

-- RLS Policies for audit_logs
CREATE POLICY "Presidents and Auditors can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'President') OR has_role(auth.uid(), 'Auditor'));

-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('officer-avatars', 'officer-avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Create storage policies for officer avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'officer-avatars');

CREATE POLICY "Presidents can upload officer avatars"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'officer-avatars' AND has_role(auth.uid(), 'President'));

CREATE POLICY "Presidents can update officer avatars"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'officer-avatars' AND has_role(auth.uid(), 'President'));

-- Create storage policies for documents
CREATE POLICY "Users can view documents they have access to"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' AND (
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

CREATE POLICY "Users can upload documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND (
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

-- Create storage policies for receipts
CREATE POLICY "Users can view receipts they have access to"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'receipts' AND (
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

CREATE POLICY "Users can upload receipts"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' AND (
      has_role(auth.uid(), 'President') OR 
      has_role(auth.uid(), 'Secretary') OR 
      has_role(auth.uid(), 'Auditor')
    )
  );

-- Insert sample officers
INSERT INTO public.officers (name, role, email, bio, avatar_url) VALUES
('Alex Johnson', 'President', 'president@sbo.edu', 'Senior majoring in Business Administration. Passionate about student representation and campus improvement.', null),
('Sarah Chen', 'Auditor', 'auditor@sbo.edu', 'Junior studying Accounting and Finance. Dedicated to financial transparency and responsible budget management.', null),
('Marcus Williams', 'Secretary', 'secretary@sbo.edu', 'Sophomore in Communications. Focused on keeping students informed and engaged with SBO activities.', null);

-- Insert sample budget allocations with zero amounts initially
INSERT INTO public.budget_allocations (user_id, category, allocated_amount, created_by) VALUES
(gen_random_uuid(), 'Events', 0, gen_random_uuid()),
(gen_random_uuid(), 'Supplies', 0, gen_random_uuid()),
(gen_random_uuid(), 'Marketing', 0, gen_random_uuid()),
(gen_random_uuid(), 'Technology', 0, gen_random_uuid()),
(gen_random_uuid(), 'Travel', 0, gen_random_uuid()),
(gen_random_uuid(), 'Miscellaneous', 0, gen_random_uuid());