-- Fix recursive RLS policy on user_roles and switch policies to use has_role()
-- Ensure RLS is enabled where needed (idempotent)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

-- 1) user_roles: remove recursive SELECT policy and recreate using has_role()
DROP POLICY IF EXISTS "Users can view user roles" ON public.user_roles;
CREATE POLICY "Users can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'President')
  OR public.has_role(auth.uid(), 'Auditor')
);

-- 2) announcements: use has_role() for manage policy
DROP POLICY IF EXISTS "Presidents and Secretaries can manage announcements" ON public.announcements;
CREATE POLICY "Presidents and Secretaries can manage announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'President') OR public.has_role(auth.uid(), 'Secretary')
)
WITH CHECK (
  public.has_role(auth.uid(), 'President') OR public.has_role(auth.uid(), 'Secretary')
);

-- 3) events: use has_role() for manage policy
DROP POLICY IF EXISTS "Presidents and Secretaries can manage events" ON public.events;
CREATE POLICY "Presidents and Secretaries can manage events"
ON public.events
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'President') OR public.has_role(auth.uid(), 'Secretary')
)
WITH CHECK (
  public.has_role(auth.uid(), 'President') OR public.has_role(auth.uid(), 'Secretary')
);

-- 4) documents: use has_role() for manage policy
DROP POLICY IF EXISTS "All roles can manage documents" ON public.documents;
CREATE POLICY "All roles can manage documents"
ON public.documents
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'President')
  OR public.has_role(auth.uid(), 'Secretary')
  OR public.has_role(auth.uid(), 'Auditor')
)
WITH CHECK (
  public.has_role(auth.uid(), 'President')
  OR public.has_role(auth.uid(), 'Secretary')
  OR public.has_role(auth.uid(), 'Auditor')
);

-- 5) budget_allocations: use has_role() for manage policy
DROP POLICY IF EXISTS "Presidents can manage budget allocations" ON public.budget_allocations;
CREATE POLICY "Presidents can manage budget allocations"
ON public.budget_allocations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'President'))
WITH CHECK (public.has_role(auth.uid(), 'President'));

-- 6) expenses: replace role checks with has_role()
DROP POLICY IF EXISTS "Auditors can view all expenses" ON public.expenses;
CREATE POLICY "Auditors can view all expenses"
ON public.expenses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'Auditor'));

DROP POLICY IF EXISTS "Presidents can manage all expenses" ON public.expenses;
CREATE POLICY "Presidents can manage all expenses"
ON public.expenses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'President'))
WITH CHECK (public.has_role(auth.uid(), 'President'));

DROP POLICY IF EXISTS "Secretaries can insert expenses" ON public.expenses;
CREATE POLICY "Secretaries can insert expenses"
ON public.expenses
FOR INSERT
TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'Secretary') OR public.has_role(auth.uid(), 'President'))
  AND auth.uid() = created_by
);

-- Keep existing generic authenticated SELECT policies as-is on each table
