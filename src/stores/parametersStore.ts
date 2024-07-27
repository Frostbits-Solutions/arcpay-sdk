import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AlgodClient } from '@/lib/algod/AlgodClient'
import type { SupabaseClient } from '@supabase/supabase-js'

export const useParametersStore = defineStore('parametersStore', () => {
    const supabase: Ref<SupabaseClient | undefined> = ref()
    const algod: Ref<AlgodClient | undefined> = ref()
    const accountId: Ref<number | undefined> = ref()
    const nftAppID: Ref<number | undefined> = ref()
    const nftID: Ref<number | undefined> = ref()
    const rwaId: Ref<string | undefined> = ref()
    const rwaName: Ref<string | undefined> = ref()
    const successCallback: Ref<((listingId: string) => void) | undefined> = ref()
    const errorCallback: Ref<((error: Error) => void) | undefined> = ref()

    return {
        algod,
        supabase,
        accountId,
        nftAppID,
        nftID,
        rwaId,
        rwaName,
        successCallback,
        errorCallback
    }
})
