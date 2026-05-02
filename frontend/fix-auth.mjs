/**
 * Fix corrupted auth.users rows by re-creating accounts via Supabase Auth API.
 * Run once:  node fix-auth.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bvqcgbtyzgfqlbecwamu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cWNnYnR5emdmcWxiZWN3YW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTQxMDQsImV4cCI6MjA5MjgzMDEwNH0.XcwsUu_Zw07fMbi88aahy0lsOqybVCGd_SVNZAsobrk'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const ACCOUNTS = [
  {
    email: 'admin@campuspulse.edu',
    password: 'cbit@1979',
    meta: { name: 'Campus Admin', role: 'admin', password_ref: 'cbit@1979' },
    profile: { name: 'Campus Admin', role: 'admin', admin_level: 'super', password_ref: 'cbit@1979' },
  },
  {
    email: 'student@campuspulse.edu',
    password: 'Student@123',
    meta: { name: 'Demo Student', role: 'student', roll_no: '160122733001', password_ref: 'Student@123' },
    profile: { name: 'Demo Student', role: 'student', roll_no: '160122733001', branch: 'CSE', year: '3rd Year', section: 'A', hostel_block: 'Block A', hostel_room: '301', phone: '9876543210', password_ref: 'Student@123' },
  },
  {
    email: 'incharge@campuspulse.edu',
    password: 'Incharge@123',
    meta: { name: 'Demo In-Charge', role: 'incharge', password_ref: 'Incharge@123' },
    profile: { name: 'Demo In-Charge', role: 'incharge', employee_id: 'IC-DEMO-001', designation: 'Block Warden', assigned_block: 'Block A', phone: '9876543220', password_ref: 'Incharge@123', password_reset_required: false },
  },
]

async function fixAccount(account) {
  console.log(`\n── Fixing: ${account.email} ──`)

  // Step 1: Try signing in first (maybe it already works)
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  })

  if (!signInErr && signInData?.user) {
    console.log(`  ✅ Already works! User ID: ${signInData.user.id}`)
    await supabase.auth.signOut()
    return true
  }

  console.log(`  ⚠️  Sign-in failed: ${signInErr?.message || 'unknown error'}`)

  // Step 2: Try signing up (creates proper auth.users + identities)
  console.log(`  → Attempting signUp...`)
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: account.email,
    password: account.password,
    options: {
      data: account.meta,
    },
  })

  if (signUpErr) {
    // If "User already registered", we need to delete the old row first
    if (signUpErr.message?.includes('already registered') || signUpErr.message?.includes('already been registered')) {
      console.log(`  → User exists but auth is broken. Deleting old rows via profiles...`)
      
      // Delete old profile (auth.users row can only be deleted via SQL Editor or dashboard)
      console.log(`  ❌ Cannot auto-fix — the old auth.users row must be deleted first.`)
      console.log(`  📋 Run this in Supabase SQL Editor:`)
      console.log(`     DELETE FROM auth.users WHERE email = '${account.email}';`)
      console.log(`     DELETE FROM public.profiles WHERE email = '${account.email}';`)
      console.log(`  Then re-run this script.`)
      return false
    }
    console.log(`  ❌ SignUp error: ${signUpErr.message}`)
    return false
  }

  const uid = signUpData.user?.id
  if (!uid) {
    console.log(`  ❌ SignUp returned no user ID`)
    return false
  }

  console.log(`  ✅ Created! User ID: ${uid}`)

  // Step 3: Update profile with full data
  const { error: profileErr } = await supabase
    .from('profiles')
    .upsert({ id: uid, email: account.email, ...account.profile }, { onConflict: 'id' })

  if (profileErr) {
    console.log(`  ⚠️  Profile update error: ${profileErr.message}`)
  } else {
    console.log(`  ✅ Profile updated`)
  }

  await supabase.auth.signOut()
  return true
}

async function main() {
  console.log('🔧 CampusPulse Auth Fix Script')
  console.log('================================')
  
  for (const account of ACCOUNTS) {
    await fixAccount(account)
  }
  
  console.log('\n================================')
  console.log('Done! Try logging in now.')
}

main().catch(console.error)
