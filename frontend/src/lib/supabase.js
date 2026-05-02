import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY
const serviceKey   = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client (service_role) — used only for admin operations like creating users
// This bypasses RLS and has access to auth.admin API
export const supabaseAdmin = serviceKey
  ? createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null
