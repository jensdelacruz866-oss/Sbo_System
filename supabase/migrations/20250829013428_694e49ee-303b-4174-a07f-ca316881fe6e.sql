-- Fix officers table - role should be TEXT, not enum
ALTER TABLE public.officers 
ALTER COLUMN role TYPE TEXT;

-- Clear and insert correct sample data
DELETE FROM public.officers;

INSERT INTO public.officers (name, role, email, bio) VALUES
('Maria Santos', 'President', 'maria.santos@student.edu', 'Dedicated leader with 3 years of student government experience.'),
('Juan Dela Cruz', 'Vice President', 'juan.delacruz@student.edu', 'Passionate advocate for student rights and academic excellence.'),
('Ana Rodriguez', 'Secretary', 'ana.rodriguez@student.edu', 'Detail-oriented organizer ensuring transparent communication.'),
('Carlos Martinez', 'Treasurer', 'carlos.martinez@student.edu', 'Finance expert managing student organization funds responsibly.');