import {computed, ref} from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import algosdk from "algosdk";

export const useParameterStore = defineStore('parameterStore', () => {
    const nftID: Ref<number|null> = ref(null)
    const priceMin: Ref<number|null> = ref(null) // input for min price in dutch
    const priceMax: Ref<number|null> = ref(null) // input for max price in dutch
    const reserve: Ref<number|null> = ref(null) // input for reserve in auction
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
        if (arc200AppID.value) return algosdk.getApplicationAddress(arc200AppID.value)
        else return null
    })
    const arc200Decimals: Ref<number|null> = ref(null)
    const duration: Ref<number|null> = ref(null) // auction duration
    const feesAddress = ref('UVGMQYP246NIXHWFSLBNPFVXJ77HSXNLU3AFP3JQEUVJSTGZIMGJ3JFFZY')
    return {
        nftID,
        priceMin,
        priceMax,
        reserve,
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
    }
})
