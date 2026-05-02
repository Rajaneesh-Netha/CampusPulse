import { supabase, supabaseAdmin } from '../lib/supabase'

/* ── Get all complaints (admin view) ───────────────────────── */
export async function getAllComplaints() {
  const { data, error } = await supabase
    .from('complaints')
    .select(`*,
      student:profiles!complaints_student_id_fkey(name, roll_no, email),
      incharge:profiles!complaints_incharge_id_fkey(name, assigned_block)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/* ── Get all incharges ──────────────────────────────────────── */
export async function getAllIncharges() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'incharge')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/* ── Get all students ───────────────────────────────────────── */
export async function getAllStudents() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('name', { ascending: true })
  if (error) throw error
  return data
}

/* ── Create incharge via Supabase Auth Admin API ─────────────
   Uses service_role key to create a proper auth user, then
   updates the profile with in-charge specific fields.
   This avoids the broken raw-SQL approach that corrupted GoTrue.
   ─────────────────────────────────────────────────────────── */
export async function createIncharge({ name, email, block, designation, phone }) {
  if (!supabaseAdmin) throw new Error('Admin client not configured (missing service key)')

  // Generate temp password and employee ID
  const tempPassword = 'IC@' + Math.random().toString(36).slice(2, 10)

  // Get next employee ID
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'incharge')
  const empId = 'IC-' + new Date().getFullYear() + '-' + String((count || 0) + 1).padStart(3, '0')

  // Step 1: Create auth user via Admin API (proper GoTrue way)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name, role: 'incharge', password_ref: tempPassword },
  })
  if (authError) throw authError

  // Step 2: Update the profile (trigger may have created a basic row)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: authUser.user.id,
      name,
      email,
      role: 'incharge',
      employee_id: empId,
      designation: designation || 'In-Charge',
      assigned_block: block,
      phone: phone || '',
      password_ref: tempPassword,
      password_reset_required: true,
      is_active: true,
    }, { onConflict: 'id' })
  if (profileError) throw profileError

  return { email, tempPassword, employeeId: empId, name, block }
}

/* ── Toggle incharge active status ─────────────────────────── */
export async function toggleInchargeStatus(userId, currentStatus) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: !currentStatus })
    .eq('id', userId)
  if (error) throw error
}

/* ── Remove incharge (deactivate) ────────────────────────────── */
export async function removeIncharge(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: false })
    .eq('id', userId)
  if (error) throw error
}

/* ── Permanently delete incharge (removes auth user too) ───── */
export async function deleteInchargePermanently(userId) {
  if (!supabaseAdmin) throw new Error('Admin client not configured')
  // Delete auth user (cascades to profiles via FK)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) throw error
}

/* ── Reassign complaint to different incharge ───────────────── */
export async function reassignComplaint(complaintId, inchargeId) {
  const { error } = await supabase
    .from('complaints')
    .update({ incharge_id: inchargeId })
    .eq('id', complaintId)
  if (error) throw error
}

/* ── Get system analytics via RPC ───────────────────────────── */
export async function getAnalyticsSummary() {
  const { data, error } = await supabase.rpc('get_analytics_summary')
  if (error) throw error
  return data
}

/* ── Update admin/incharge profile ─────────────────────────── */
export async function updateAdminProfile(userId, fields) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) throw error
}
