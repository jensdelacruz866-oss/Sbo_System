-- Create budget_allocations table
CREATE TABLE public.budget_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL,
  fiscal_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  event_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create documents table for file management
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  category TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Budget Allocations Policies (President only for full access)
CREATE POLICY "Presidents can manage budget allocations" 
ON public.budget_allocations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'President'::app_role
));

CREATE POLICY "All authenticated users can view budget allocations" 
ON public.budget_allocations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Expenses Policies (Role-based access)
CREATE POLICY "Presidents can manage all expenses" 
ON public.expenses 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'President'::app_role
));

CREATE POLICY "Secretaries can add and view expenses" 
ON public.expenses 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Secretaries can insert expenses" 
ON public.expenses 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('Secretary'::app_role, 'President'::app_role)
) AND auth.uid() = created_by);

CREATE POLICY "Auditors can view all expenses" 
ON public.expenses 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'Auditor'::app_role
));

-- Events Policies
CREATE POLICY "Presidents and Secretaries can manage events" 
ON public.events 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Secretary'::app_role)
));

CREATE POLICY "All authenticated users can view public events" 
ON public.events 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND (is_public = true OR EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Secretary'::app_role, 'Auditor'::app_role)
)));

-- Announcements Policies
CREATE POLICY "Presidents and Secretaries can manage announcements" 
ON public.announcements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Secretary'::app_role)
));

CREATE POLICY "All authenticated users can view public announcements" 
ON public.announcements 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND (is_public = true OR EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Secretary'::app_role, 'Auditor'::app_role)
)));

-- Documents Policies
CREATE POLICY "All roles can manage documents" 
ON public.documents 
FOR ALL 
USING (auth.uid() IS NOT NULL AND EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Secretary'::app_role, 'Auditor'::app_role)
));

-- Audit Logs Policies (Read-only for Auditors and Presidents)
CREATE POLICY "Presidents and Auditors can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Auditor'::app_role)
));

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (auth.uid(), p_action, p_table_name, p_record_id, p_old_values, p_new_values);
END;
$$;

-- Create triggers for automatic timestamps
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

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Storage policies for documents
CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid() IS NOT NULL AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can view their documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' AND 
  auth.uid() IS NOT NULL AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Auditor'::app_role)))
);

-- Storage policies for receipts
CREATE POLICY "Authenticated users can upload receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'receipts' AND 
  auth.uid() IS NOT NULL AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can view receipts" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'receipts' AND 
  auth.uid() IS NOT NULL AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('President'::app_role, 'Auditor'::app_role)))
);

-- Add reference to events in expenses
ALTER TABLE public.expenses 
ADD CONSTRAINT fk_expenses_events 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;

-- Insert sample data
INSERT INTO public.budget_allocations (user_id, category, allocated_amount, created_by) VALUES
(gen_random_uuid(), 'Events', 50000.00, gen_random_uuid()),
(gen_random_uuid(), 'Supplies', 25000.00, gen_random_uuid()),
(gen_random_uuid(), 'Marketing', 15000.00, gen_random_uuid()),
(gen_random_uuid(), 'Technology', 30000.00, gen_random_uuid()),
(gen_random_uuid(), 'Travel', 20000.00, gen_random_uuid()),
(gen_random_uuid(), 'Miscellaneous', 10000.00, gen_random_uuid());

INSERT INTO public.events (user_id, title, description, event_date, event_time, location, created_by) VALUES
(gen_random_uuid(), 'Student Orientation', 'Welcome event for new students', '2024-09-15', '10:00', 'Main Auditorium', gen_random_uuid()),
(gen_random_uuid(), 'Spring Festival', 'Annual spring celebration', '2024-04-20', '14:00', 'Campus Quad', gen_random_uuid()),
(gen_random_uuid(), 'Budget Planning Meeting', 'Internal planning session', '2024-09-10', '15:00', 'SBO Office', gen_random_uuid());

INSERT INTO public.announcements (user_id, title, content, is_public, created_by) VALUES
(gen_random_uuid(), 'Welcome Back Students!', 'The SBO welcomes all students back for the new semester. We have exciting events planned!', true, gen_random_uuid()),
(gen_random_uuid(), 'Budget Review Meeting', 'Monthly budget review scheduled for next Friday at 3 PM in the SBO office.', false, gen_random_uuid()),
(gen_random_uuid(), 'Spring Festival Planning', 'Planning meeting for the annual spring festival. All committee members should attend.', true, gen_random_uuid());