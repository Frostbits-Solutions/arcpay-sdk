import type {SupabaseClient} from '@supabase/supabase-js'
import type {Database} from '@/lib/supabase/database.types'
import type {PublicNetwork} from '@/lib/algod/networks.config'

export async function getCurrencies(supabase: SupabaseClient, chain: PublicNetwork) {
    const {
        data,
        error
    } = await supabase.from('currencies').select('*').eq('chain', chain).returns<Database['public']['Tables']['currencies']['Row'][]>()
    return {data, error}
}

export async function getCurrency(supabase: SupabaseClient, chain: PublicNetwork, id: string) {
    const {
        data,
        error
    } = await supabase.from('currencies').select('*').eq('chain', chain).eq('id', id).returns<Database['public']['Tables']['currencies']['Row'][]>()
    return {data, error}
}
