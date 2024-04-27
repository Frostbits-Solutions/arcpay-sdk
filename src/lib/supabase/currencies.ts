import type { SupabaseClient } from '@supabase/supabase-js'

export async function getCurrencies(supabase: SupabaseClient) {
    const { data, error } = await supabase.from('currencies').select('*')
    return { data, error }
}
