-- ============================================================================
-- Patient health data + private document storage
-- ============================================================================
-- One row per signed-in patient holding their records, lab reports, medicines,
-- appointments, consents and caregivers as a JSON document, plus a private
-- storage bucket for uploaded PDFs and photos. Row Level Security makes sure
-- people can only ever read and write their own row and their own folder.
-- Safe to run more than once.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.health_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "health_data_select_own" ON public.health_data;
DROP POLICY IF EXISTS "health_data_insert_own" ON public.health_data;
DROP POLICY IF EXISTS "health_data_update_own" ON public.health_data;
DROP POLICY IF EXISTS "health_data_delete_own" ON public.health_data;

CREATE POLICY "health_data_select_own" ON public.health_data
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "health_data_insert_own" ON public.health_data
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "health_data_update_own" ON public.health_data
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "health_data_delete_own" ON public.health_data
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_health_data()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS health_data_touch ON public.health_data;
CREATE TRIGGER health_data_touch
  BEFORE UPDATE ON public.health_data
  FOR EACH ROW EXECUTE FUNCTION public.touch_health_data();

-- ---------------------------------------------------------------------------
-- Private bucket for uploaded documents. Files live under "<user id>/...".
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-documents',
  'medical-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "medical_documents_select_own" ON storage.objects;
DROP POLICY IF EXISTS "medical_documents_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "medical_documents_update_own" ON storage.objects;
DROP POLICY IF EXISTS "medical_documents_delete_own" ON storage.objects;

CREATE POLICY "medical_documents_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'medical-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "medical_documents_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'medical-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "medical_documents_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'medical-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "medical_documents_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'medical-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
