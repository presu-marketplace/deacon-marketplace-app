import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// minimal placeholder; use your generated Database type if you have one
type DB = { api: Record<string, unknown> }

let client: SupabaseClient<DB, 'api'> | null = null

export function getSupabaseAdmin(): SupabaseClient<DB, 'api'> {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  client = createClient<DB, 'api'>(url, serviceKey, {
    auth: { persistSession: false },
    db: { schema: 'api' },
  })
  return client
}
