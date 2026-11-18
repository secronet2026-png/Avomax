-- 005_inquiries.sql
-- Inquiries & Prospective Student Leads module for AvomaxCRM

CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  destination_country VARCHAR(100),
  program_of_interest VARCHAR(255),
  intake VARCHAR(50),
  passport_id VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(50),
  marital_status VARCHAR(50),
  nationality VARCHAR(100),
  high_school VARCHAR(255),
  address VARCHAR(300),
  notes TEXT,
  heard_from VARCHAR(255),
  source VARCHAR(50) NOT NULL DEFAULT 'website',
  status VARCHAR(50) NOT NULL DEFAULT 'New',
  assigned_counselor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  counselor_notes TEXT,
  converted_student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_counselor ON public.inquiries(assigned_counselor_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_source ON public.inquiries(source);

-- Add update trigger for updated_at
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- RLS policies
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous insert for online inquiry forms
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated staff can view inquiries
DROP POLICY IF EXISTS "Staff can read inquiries" ON public.inquiries;
CREATE POLICY "Staff can read inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_active = TRUE
        AND (
          public.profiles.role IN ('super_admin', 'admin', 'viewer')
          OR (public.profiles.role = 'counselor' AND (inquiries.assigned_counselor_id = auth.uid() OR inquiries.assigned_counselor_id IS NULL))
        )
    )
  );

-- Staff can update inquiries
DROP POLICY IF EXISTS "Staff can update inquiries" ON public.inquiries;
CREATE POLICY "Staff can update inquiries"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_active = TRUE
        AND public.profiles.role IN ('super_admin', 'admin', 'counselor')
    )
  );

-- Only Super Admins and Admins can delete inquiries
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;
CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_active = TRUE
        AND public.profiles.role IN ('super_admin', 'admin')
    )
  );
