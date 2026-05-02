/**
 * Recreate auth accounts via Supabase Admin API.
 * Run AFTER cleanup_auth.sql has been executed in SQL Editor.
 * Usage: node recreate-accounts.mjs
 */

const SUPABASE_URL = 'https://bvqcgbtyzgfqlbecwamu.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cWNnYnR5emdmcWxiZWN3YW11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI1NDEwNCwiZXhwIjoyMDkyODMwMTA0fQ.MnvciqqNALemEMUpcQ5f7czNzH59Jx3y8O2cb9yTvG0'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cWNnYnR5emdmcWxiZWN3YW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTQxMDQsImV4cCI6MjA5MjgzMDEwNH0.XcwsUu_Zw07fMbi88aahy0lsOqybVCGd_SVNZAsobrk'

const adminHeaders = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

const ACCOUNTS = [
  {
    email: 'admin@campuspulse.edu',
    password: 'cbit@1979',
    user_metadata: { name: 'Campus Admin', role: 'admin' },
    profile: { name: 'Campus Admin', role: 'admin', admin_level: 'super', password_ref: 'cbit@1979' },
  },
  {
    email: 'student@campuspulse.edu',
    password: 'Student@123',
    user_metadata: { name: 'Demo Student', role: 'student', roll_no: '160122733001' },
    profile: { name: 'Demo Student', role: 'student', roll_no: '160122733001', branch: 'CSE', year: '3rd Year', section: 'A', hostel_block: 'Block A', hostel_room: '301', phone: '9876543210', password_ref: 'Student@123' },
  },
  {
    email: 'incharge@campuspulse.edu',
    password: 'Incharge@123',
    user_metadata: { name: 'Demo In-Charge', role: 'incharge' },
    profile: { name: 'Demo In-Charge', role: 'incharge', employee_id: 'IC-DEMO-001', designation: 'Block Warden', assigned_block: 'Block A', phone: '9876543220', password_ref: 'Incharge@123', password_reset_required: false },
  },
]

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function createAccount(account) {
  console.log(`\n── Creating: ${account.email} ──`)

  // Create user via Admin API
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: account.user_metadata,
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    console.log(`  ❌ Create failed (${createRes.status}): ${err}`)
    return false
  }

  const user = await createRes.json()
  console.log(`  ✅ Created: ${user.id}`)

  // Wait a moment for the trigger to create the profile row
  await sleep(500)

  // Update profile with full data
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ email: account.email, ...account.profile }),
  })

  if (profileRes.ok) {
    console.log(`  ✅ Profile updated`)
  } else {
    // Try upsert if PATCH failed
    const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...adminHeaders, 'Prefer': 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify({ id: user.id, email: account.email, ...account.profile }),
    })
    console.log(upsertRes.ok ? `  ✅ Profile upserted` : `  ⚠️ Profile error: ${await upsertRes.text()}`)
  }

  return true
}

async function testLogin(email, password, label) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (res.ok) {
    const data = await res.json()
    console.log(`  ✅ ${label}: LOGIN SUCCESS (role: ${data.user?.user_metadata?.role})`)
    return true
  } else {
    const err = await res.text()
    console.log(`  ❌ ${label}: FAILED (${res.status}) ${err.substring(0, 100)}`)
    return false
  }
}

async function main() {
  console.log('🔧 CampusPulse — Recreate Auth Accounts')
  console.log('=========================================')
  console.log('⚠️  Make sure you ran cleanup_auth.sql in SQL Editor first!\n')

  // Check if cleanup was done
  const checkRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
    headers: adminHeaders,
  })

  if (!checkRes.ok) {
    console.log(`❌ Admin API still returning ${checkRes.status}. The corrupted rows may still exist.`)
    console.log('   Please run cleanup_auth.sql in the Supabase SQL Editor first!')
    const err = await checkRes.text()
    console.log(`   Error: ${err.substring(0, 150)}`)
    return
  }

  const { users } = await checkRes.json()
  const conflicting = users.filter(u =>
    ACCOUNTS.some(a => a.email === u.email)
  )
  if (conflicting.length > 0) {
    console.log(`⚠️ Found ${conflicting.length} existing accounts that should have been cleaned:`)
    conflicting.forEach(u => console.log(`   - ${u.email} (${u.id})`))
    console.log('   Please run cleanup_auth.sql first!')
    return
  }

  console.log(`✅ Admin API working. ${users.length} existing users found.`)

  // Create each account
  let success = 0
  for (const account of ACCOUNTS) {
    const ok = await createAccount(account)
    if (ok) success++
    await sleep(300) // Avoid rate limits
  }

  console.log(`\n\n📊 Created ${success}/${ACCOUNTS.length} accounts`)

  // Test logins
  console.log('\n🔑 Testing logins...')
  console.log('────────────────────')
  await testLogin('admin@campuspulse.edu', 'cbit@1979', 'Admin')
  await testLogin('incharge@campuspulse.edu', 'Incharge@123', 'InCharge')
  await testLogin('student@campuspulse.edu', 'Student@123', 'Student')

  console.log('\n=========================================')
  console.log('Done! Refresh your browser and try logging in.')
}

main().catch(console.error)
