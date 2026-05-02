-- ============================================================
--  CampusPulse — NUCLEAR CLEANUP of corrupted auth rows
--  Run ALL of this in Supabase SQL Editor
--  This removes ONLY the SQL-seeded accounts (not real signups)
-- ============================================================

-- Step 1: Remove from all auth-related tables
DO $$
DECLARE
  bad_emails TEXT[] := ARRAY[
    'admin@campuspulse.edu',
    'student@campuspulse.edu',
    'incharge@campuspulse.edu',
    'rahul@campuspulse.edu',
    'priya@campuspulse.edu',
    'kumar@campuspulse.edu',
    'arjun@campuspulse.edu',
    'radhika@campuspulse.edu',
    'divya@campuspulse.edu'
  ];
  bad_ids UUID[];
BEGIN
  -- Collect the corrupted user IDs
  SELECT ARRAY_AGG(id) INTO bad_ids
  FROM auth.users
  WHERE email = ANY(bad_emails);

  IF bad_ids IS NULL THEN
    RAISE NOTICE 'No corrupted users found - already cleaned';
    RETURN;
  END IF;

  RAISE NOTICE 'Found % corrupted users to delete', array_length(bad_ids, 1);

  -- Delete in dependency order
  DELETE FROM auth.mfa_factors WHERE user_id = ANY(bad_ids);
  DELETE FROM auth.sessions WHERE user_id = ANY(bad_ids);
  DELETE FROM auth.refresh_tokens WHERE session_id IN (
    SELECT id FROM auth.sessions WHERE user_id = ANY(bad_ids)
  );
  DELETE FROM auth.identities WHERE user_id = ANY(bad_ids);
  DELETE FROM public.complaints WHERE student_id = ANY(bad_ids);
  DELETE FROM public.profiles WHERE id = ANY(bad_ids);
  DELETE FROM auth.users WHERE id = ANY(bad_ids);

  RAISE NOTICE 'Cleanup complete!';
END $$;

-- Step 2: Also clean up orphaned profiles (no matching auth user)
DELETE FROM public.profiles
WHERE email IN (
  'admin@campuspulse.edu',
  'student@campuspulse.edu',
  'incharge@campuspulse.edu',
  'rahul@campuspulse.edu',
  'priya@campuspulse.edu',
  'kumar@campuspulse.edu',
  'arjun@campuspulse.edu',
  'radhika@campuspulse.edu',
  'divya@campuspulse.edu'
)
AND id NOT IN (SELECT id FROM auth.users);

-- Step 3: Verify cleanup
SELECT 'auth.users remaining' AS check_type, count(*) AS cnt FROM auth.users
UNION ALL
SELECT 'profiles remaining', count(*) FROM public.profiles;
