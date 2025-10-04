-- Allow unauthenticated users to view public events
CREATE POLICY "Public users can view public events"
ON public.events
FOR SELECT
TO anon
USING (is_public = true);