-- Configure Supabase Auth settings
-- This migration sets up email verification and auth workflows

-- Enable email confirmations
-- Note: This is typically configured in Supabase Dashboard > Authentication > Settings
-- but we document it here for reference

-- Create auth email templates (configured in Supabase Dashboard)
-- Templates needed:
-- 1. Confirmation email (signup)
-- 2. Magic link (passwordless)
-- 3. Password reset
-- 4. Email change confirmation

-- Auth URL configuration
-- Site URL: Set in Supabase Dashboard
-- Redirect URLs: Configure allowed redirect URLs

-- Create function to handle user metadata updates
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user profile when auth.users metadata changes
  UPDATE public.user_profiles
  SET
    email = NEW.email,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync auth.users changes to user_profiles
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_metadata_update();

-- Add indexes for auth-related queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_verified ON user_profiles(email_verified);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;

-- Comments
COMMENT ON FUNCTION public.handle_user_metadata_update() IS 'Syncs auth.users changes to user_profiles table';
