import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export async function getCurrencies(supabase: SupabaseClient) {
    const { data, error } = await supabase.from('currencies').select('*').returns<Database['public']['Tables']['currencies']['Row'][]>()
    return { data, error }
}
