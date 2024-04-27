import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export function createSupabaseClient(apikey: string) {
  return createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          'X-ARCPAY-KEY': apikey,
        }
      }
    }
  )
}
