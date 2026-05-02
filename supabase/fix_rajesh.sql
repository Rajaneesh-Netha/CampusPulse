-- ============================================================
--  Fix the corrupted rajesh@campuspulse.edu account
--  Run this in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  bad_id UUID;
BEGIN
  -- Find the corrupted user
  SELECT id INTO bad_id FROM auth.users WHERE email = 'rajesh@campuspulse.edu';

  IF bad_id IS NULL THEN
    RAISE NOTICE 'No corrupted rajesh user found';
    RETURN;
  END IF;

  RAISE NOTICE 'Deleting corrupted auth rows for rajesh (id: %)', bad_id;

  -- Clean up in dependency order
  DELETE FROM auth.mfa_factors WHERE user_id = bad_id;
  DELETE FROM auth.sessions WHERE user_id = bad_id;
  DELETE FROM auth.identities WHERE user_id = bad_id;
  DELETE FROM public.profiles WHERE id = bad_id;
  DELETE FROM auth.users WHERE id = bad_id;

  RAISE NOTICE 'Cleanup done! Rajesh can now be recreated via the Admin API.';
END $$;

-- Verify
SELECT 'auth.users' AS tbl, count(*) FROM auth.users
UNION ALL
SELECT 'profiles', count(*) FROM public.profiles;
