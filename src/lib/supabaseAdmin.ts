// lib/supabaseAdmin.ts
import 'server-only'                       // prevent accidental client import
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type DB = { api: Record<string, unknown> }

let client: SupabaseClient<DB, 'api'> | null = null

export function getSupabaseAdmin(): SupabaseClient<DB, 'api'> {
  if (client) return client
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing SUPABASE_URL / SERVICE_ROLE_KEY')
  client = createClient<DB, 'api'>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'api' },
  })
  return client
}
