import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Base client used for authentication helpers
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'api' },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Creates a client that explicitly sends both apikey and Authorization headers
export async function getAuthedClient(): Promise<SupabaseClient> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const headers: Record<string, string> = { apikey: supabaseAnonKey }
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'api' },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: { headers },
  })
}
