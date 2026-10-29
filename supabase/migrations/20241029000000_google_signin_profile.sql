-- ============================================================================
-- Google sign-in support for the auto-created profile
-- ============================================================================
-- Google (and other OAuth providers) put the person's name in `full_name` or `name`
-- and send no `role`. The app is patient-only now, so every new account is a patient.
-- Replaces handle_new_user() from the earlier migrations. Safe to run more than once.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  user_full_name := COALESCE(
    NULLIF(TRIM(BOTH '"' FROM COALESCE(NEW.raw_user_meta_data->>'full_name', '')), ''),
    NULLIF(TRIM(BOTH '"' FROM COALESCE(NEW.raw_user_meta_data->>'name', '')), ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    'User'
  );

  INSERT INTO public.user_profiles (user_id, role, full_name)
  VALUES (NEW.id, 'patient', user_full_name)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block a sign-up because the profile row failed.
    RAISE WARNING 'Error creating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists (it is created in the first migration).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
