import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import algosdk from "algosdk";
import type { SupabaseClient } from '@supabase/supabase-js'
import { getListingById } from '@/lib/supabase/listings'

export const useParametersStore = defineStore('parametersStore', () => {
    const nftID: Ref<number|null> = ref(null)
    const priceMin: Ref<number|null> = ref(null) // input for min price in dutch
    const priceMax: Ref<number|null> = ref(null) // input for max price in dutch
    const price: Ref<number|null> = ref(null)
    const seller: Ref<string|null> = ref(null)
    const appIndex: Ref<number|null> = ref(null)
    const appAddress: Ref<string|null> = computed(() => {
        if (appIndex.value) return algosdk.getApplicationAddress(appIndex.value)
        else return null
    })
    const nftAppID: Ref<number|null> = ref(null)
    const arc200AppID: Ref<number|null> = ref(null)
    const arc200AppAddress: Ref<string|null> = computed(() => {
        console.log(arc200AppID.value)
        if (arc200AppID.value) return algosdk.getApplicationAddress(arc200AppID.value)
        else return null
    })
    const arc200Decimals: Ref<number|null> = ref(null)
    const duration: Ref<number|null> = ref(null) // auction duration
    const feesAddress = ref('UVGMQYP246NIXHWFSLBNPFVXJ77HSXNLU3AFP3JQEUVJSTGZIMGJ3JFFZY')
    const rwaId: Ref<string|null> = ref(null)
    const rwaName: Ref<string|null> = ref(null)

    async function getListingParameters(client: SupabaseClient, listing_id: string) {
        const { data, error } = await getListingById(client, listing_id)
        if (error) {
            console.error(error)
            return
        }

        [nftAppID.value, nftID.value] = data.asset_id.split('/').map(Number)
        priceMin.value = Number(data.min_price)
        priceMax.value = Number(data.max_price)
        price.value = Number(data.asking_price)
        seller.value = data.seller_address
        appIndex.value = Number(data.app_id)
        arc200AppID.value = data.listing_currency === 0 ? null : Number(data.listing_currency)
        duration.value = Number(data.duration)
        rwaId.value = data.asset_id
        rwaName.value = data.listing_name
    }

    return {
        nftID,
        priceMin,
        priceMax,
        price,
        seller,
        appIndex,
        appAddress,
        nftAppID,
        arc200AppID,
        arc200AppAddress,
        feesAddress,
        arc200Decimals,
        duration,
        rwaId,
        rwaName,
        getListingParameters,
    }
})
