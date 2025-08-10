import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient<unknown, 'api'> | null = null

export function getSupabaseAdmin(): SupabaseClient<unknown, 'api'> {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  client = createClient<unknown, 'api'>(url, serviceKey, {
    auth: { persistSession: false },
    db: { schema: 'api' },
  })
  return client
}
