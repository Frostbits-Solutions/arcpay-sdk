import {createClient, SupabaseClient} from '@supabase/supabase-js'
import type {Database} from './database.types'

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

export async function deriveAccountIdFromKey(client: SupabaseClient, apiKey: string) {
    if (apiKey) {
        return client.rpc('get_key_account_id', {
            key: apiKey,
            origin: window.location.origin
        }).returns<Database['public']['Functions']['get_key_account_id']['Returns']>()
    }
    throw new Error('Unable to derive account ID from key. No API key provided.')
}
