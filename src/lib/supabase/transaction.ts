import type { RealtimePostgresInsertPayload, SupabaseClient } from '@supabase/supabase-js'

export async function subscribeToAppTransactions(
  supabase: SupabaseClient,
  app_id: number,
  callback: (payload: RealtimePostgresInsertPayload<{ [p: string]: any }>) => {}
) {
    supabase.channel(`transactions:${app_id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `app_id=eq.${app_id}`},
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()
}
