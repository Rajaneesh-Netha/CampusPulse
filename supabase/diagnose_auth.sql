-- ============================================================
--  CampusPulse — Diagnose & Fix Auth Schema Issues
--  Run this in Supabase SQL Editor
-- ============================================================

-- ── STEP 1: Check for triggers on auth.users that may be broken ──
SELECT tgname, tgrelid::regclass, tgfoid::regproc, tgenabled
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass;

-- ── STEP 2: Check for any custom functions referencing auth schema ──
SELECT routine_name, routine_schema
FROM information_schema.routines
WHERE routine_definition ILIKE '%auth.users%'
  AND routine_schema = 'public';

-- ── STEP 3: Check if there are broken foreign keys from profiles to auth ──
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS references_table
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND contype = 'f';

-- ── STEP 4: Check if any auth.users rows have NULL or empty identity data ──
SELECT u.id, u.email, u.created_at,
       (SELECT count(*) FROM auth.identities i WHERE i.user_id = u.id) AS identity_count
FROM auth.users u
WHERE u.email IN (
  'admin@campuspulse.edu',
  'student@campuspulse.edu',
  'incharge@campuspulse.edu'
);

-- ── STEP 5: Check auth schema version ──
SELECT * FROM auth.schema_migrations ORDER BY version DESC LIMIT 5;
