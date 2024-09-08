import type { RealtimePostgresInsertPayload, SupabaseClient } from '@supabase/supabase-js'
import type {Database} from "@/lib/supabase/database.types";

export async function getTransactions(supabase: SupabaseClient, app_id: number) {
    const { data, error } =  await supabase.from('transactions').select('*').eq('app_id', app_id).returns<Database['public']['Tables']['transactions']['Row'][]>()
    return { data, error }
}

export function subscribeToAppTransactions(
  supabase: SupabaseClient,
  app_id: number,
  insertCallback: (payload: RealtimePostgresInsertPayload<{ [p: string]: any }>) => void,
  presenceCallback: (count: number) => void
) {
    const room = supabase.channel(`transactions:${app_id}`)
    room.on('presence', { event: 'sync' }, () => {
        const newState = room.presenceState()
        presenceCallback(Object.keys(newState).length)
    }).on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `app_id=eq.${app_id}`},
        (payload) => {
            insertCallback(payload)
        }
    ).subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') { return }
        await room.track({
            online_at: new Date().toISOString(),
        })
    })
    return room
}