/**
 * Fix auth accounts using Supabase Admin API (service_role key).
 * This creates proper auth.users + auth.identities rows.
 * Run: node fix-auth-admin.mjs
 */

const SUPABASE_URL = 'https://bvqcgbtyzgfqlbecwamu.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cWNnYnR5emdmcWxiZWN3YW11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI1NDEwNCwiZXhwIjoyMDkyODMwMTA0fQ.MnvciqqNALemEMUpcQ5f7czNzH59Jx3y8O2cb9yTvG0'

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
}

const ACCOUNTS = [
  {
    email: 'admin@campuspulse.edu',
    password: 'cbit@1979',
    user_metadata: { name: 'Campus Admin', role: 'admin', password_ref: 'cbit@1979' },
    profile: { name: 'Campus Admin', role: 'admin', admin_level: 'super', password_ref: 'cbit@1979' },
  },
  {
    email: 'student@campuspulse.edu',
    password: 'Student@123',
    user_metadata: { name: 'Demo Student', role: 'student', roll_no: '160122733001', password_ref: 'Student@123' },
    profile: { name: 'Demo Student', role: 'student', roll_no: '160122733001', branch: 'CSE', year: '3rd Year', section: 'A', hostel_block: 'Block A', hostel_room: '301', phone: '9876543210', password_ref: 'Student@123' },
  },
  {
    email: 'incharge@campuspulse.edu',
    password: 'Incharge@123',
    user_metadata: { name: 'Demo In-Charge', role: 'incharge', password_ref: 'Incharge@123' },
    profile: { name: 'Demo In-Charge', role: 'incharge', employee_id: 'IC-DEMO-001', designation: 'Block Warden', assigned_block: 'Block A', phone: '9876543220', password_ref: 'Incharge@123', password_reset_required: false },
  },
  {
    email: 'rahul@campuspulse.edu',
    password: 'Student@123',
    user_metadata: { name: 'Rahul Sharma', role: 'student', roll_no: '1601-21-748-001', password_ref: 'Student@123' },
    profile: { name: 'Rahul Sharma', role: 'student', roll_no: '1601-21-748-001', branch: 'CSE', year: '3rd Year', section: 'A', hostel_block: 'Block A', hostel_room: '204', phone: '9876543211', password_ref: 'Student@123' },
  },
  {
    email: 'priya@campuspulse.edu',
    password: 'Student@123',
    user_metadata: { name: 'Priya Reddy', role: 'student', roll_no: '1601-21-748-002', password_ref: 'Student@123' },
    profile: { name: 'Priya Reddy', role: 'student', roll_no: '1601-21-748-002', branch: 'ECE', year: '2nd Year', section: 'B', hostel_block: 'Block C', hostel_room: '312', phone: '9876543212', password_ref: 'Student@123' },
  },
  {
    email: 'kumar@campuspulse.edu',
    password: 'InCharge@123',
    user_metadata: { name: 'Dr. Kumar', role: 'incharge', password_ref: 'InCharge@123' },
    profile: { name: 'Dr. Kumar', role: 'incharge', employee_id: 'IC-2024-003', designation: 'Block In-Charge', assigned_block: 'Block B', phone: '9876543221', password_ref: 'InCharge@123', password_reset_required: false },
  },
]

async function deleteUser(email) {
  // Find user by email via admin API
  const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, { headers })
  if (!listRes.ok) { console.log(`  ⚠️ Could not list users: ${listRes.status}`); return }
  const { users } = await listRes.json()
  const existing = users.find(u => u.email === email)
  if (!existing) { console.log(`  ℹ️ No existing auth user for ${email}`); return }

  // Delete via admin API
  const delRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${existing.id}`, {
    method: 'DELETE',
    headers,
  })
  if (delRes.ok) {
    console.log(`  🗑️ Deleted old auth user: ${existing.id}`)
  } else {
    console.log(`  ⚠️ Delete failed: ${delRes.status} ${await delRes.text()}`)
  }
}

async function createUser(account) {
  // Create via admin API (produces proper identities)
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: account.user_metadata,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.log(`  ❌ Create failed: ${res.status} ${err}`)
    return null
  }

  const user = await res.json()
  console.log(`  ✅ Created user: ${user.id}`)
  return user.id
}

async function updateProfile(uid, email, profileData) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${uid}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ email, ...profileData }),
  })

  if (res.ok) {
    console.log(`  ✅ Profile updated`)
  } else {
    // Profile might not exist yet (if trigger didn't create it), try upsert
    const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify({ id: uid, email, ...profileData }),
    })
    if (upsertRes.ok) {
      console.log(`  ✅ Profile created via upsert`)
    } else {
      console.log(`  ⚠️ Profile update failed: ${await upsertRes.text()}`)
    }
  }
}

async function testLogin(email, password, label) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': SERVICE_ROLE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (res.ok) {
    const data = await res.json()
    console.log(`  🔑 ${label} login: ✅ SUCCESS (role: ${data.user?.user_metadata?.role})`)
  } else {
    const err = await res.text()
    console.log(`  🔑 ${label} login: ❌ FAILED (${res.status}) ${err}`)
  }
}

async function main() {
  console.log('🔧 CampusPulse Auth Fix (Admin API)')
  console.log('====================================\n')

  for (const account of ACCOUNTS) {
    console.log(`\n── ${account.user_metadata.name} (${account.email}) ──`)

    // Step 1: Delete old user
    await deleteUser(account.email)

    // Step 2: Create new user via Admin API
    const uid = await createUser(account)
    if (!uid) continue

    // Step 3: Update profile
    await updateProfile(uid, account.email, account.profile)
  }

  // Step 4: Test logins
  console.log('\n\n🔑 Testing logins...')
  console.log('────────────────────')
  await testLogin('admin@campuspulse.edu', 'cbit@1979', 'Admin')
  await testLogin('incharge@campuspulse.edu', 'Incharge@123', 'InCharge')
  await testLogin('student@campuspulse.edu', 'Student@123', 'Student')

  console.log('\n====================================')
  console.log('Done!')
}

main().catch(console.error)
