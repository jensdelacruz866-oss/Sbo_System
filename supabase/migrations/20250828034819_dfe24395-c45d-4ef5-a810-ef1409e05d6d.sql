-- Insert sample user roles for testing (you'll need to manually assign these to actual users)
-- This is just to set up the structure - presidents will need to be assigned manually through Supabase dashboard

-- Insert sample officers data
INSERT INTO public.officers (name, role, email, bio, term_start) VALUES 
('Angela Sapaula', 'President', 'president@sbo.edu', 'Senior majoring in Business Administration. Passionate about student representation and campus improvement.', '2023-09-01'),
('Sarah Chen', 'Auditor', 'auditor@sbo.edu', 'Junior studying Accounting and Finance. Dedicated to financial transparency and responsible budget management.', '2023-09-01'),
('Marcus Williams', 'Secretary', 'secretary@sbo.edu', 'Sophomore in Communications. Focused on keeping students informed and engaged with SBO activities.', '2023-09-01');