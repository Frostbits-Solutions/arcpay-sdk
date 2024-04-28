//@ts-nocheck
import {CONTRACT_TYPE, CONVENTION_TYPE, TRANSACTION_STATE, TRANSACTION_TYPE} from "@/constants"
import type {Ref} from "vue";
import {computed, ref} from "vue";
import {defineStore} from "pinia";
import {Transaction} from "@/transaction";
import {getTransactionFunction} from "@/lib/contracts/getTransactionFunction";
import { createAuction, createSale } from '@/lib/supabase/listings'
import type { SupabaseClient } from '@supabase/supabase-js'

export const useTransactionStore = defineStore('transactionStore', () => {
    const client:SupabaseClient = ref(null)
    const walletStore = ref(null)
    const parameterStore = ref(null)
    const transactionType: Ref<TRANSACTION_TYPE | null> = ref(null)
    const contractType: Ref<CONTRACT_TYPE | null> = ref(null)
    const conventionType: Ref<CONVENTION_TYPE | null> = ref(null)
    const state = ref(TRANSACTION_STATE.idle)
    const errorInfo: Ref<object | null> = ref(null)
    const successInfo: Ref<object | null> = ref(null)
    async function doTransaction () {
        try{
            if (
                walletStore.value === null ||
                transactionType.value === null ||
                conventionType.value === null ||
                contractType.value === null
            ) {
                throw {
                    message: 'null values for the transaction'
                }
            }
            state.value = TRANSACTION_STATE.initiatingTransaction
            const transactionFunction =
                getTransactionFunction(
                    transactionType.value,
                    conventionType.value,
                    contractType.value
                )
            const txnObjs = await transactionFunction(walletStore.value.provider, walletStore.value.account, parameterStore.value)

            const transaction = new Transaction(txnObjs)
            const txns = await transaction.createTxns(walletStore.value.provider.algosdk, walletStore.value.provider.algodClient)

            state.value = TRANSACTION_STATE.signingTransaction
            const signedTxn = await walletStore.value.provider.signTransactions(txns, true)

            if (transactionType.value === TRANSACTION_TYPE.create && client.value) {
                if (contractType.value === CONTRACT_TYPE.Sale) {
                    const {data, error} = await createSale(
                      client,
                      parameterStore.value.account_id,
                      txnObjs[txnObjs.length - 1].appIndex,
                      "Unknown",
                      parameterStore.value.nftId ? `${parameterStore.value.nftAppID}/${parameterStore.value.nftID}` : parameterStore.value.rwaId,
                      1,
                      `https://prod.cdn.highforge.io/t/${parameterStore.value.nftAppID}/${parameterStore.value.nftID}.webp`,
                      conventionType.value < 1 ? 'ARC72' : 'OFFCHAIN',
                      'voi:testnet',
                      parameterStore.value.arc200AppID ? parameterStore.value.arc200AppID :0,
                      conventionType.value < 1 ? 'ARC72 NFT' : 'OFFCHAIN Asset',
                      parameterStore.value.seller,
                      null,
                      parameterStore.value.price
                    )
                    if (error) {
                        console.error(error)
                    }
                } else  {
                    const {data, error} = await createAuction(
                      client,
                      parameterStore.value.account_id,
                      txnObjs[txnObjs.length - 1].appIndex,
                      "Unknown",
                      parameterStore.value.nftId ? `${parameterStore.value.nftAppID}/${parameterStore.value.nftID}` : parameterStore.value.rwaId,
                      1,
                      `https://prod.cdn.highforge.io/t/${parameterStore.value.nftAppID}/${parameterStore.value.nftID}.webp`,
                      conventionType.value < 1 ? 'ARC72' : 'OFFCHAIN',
                      'voi:testnet',
                      parameterStore.value.arc200AppID ? parameterStore.value.arc200AppID :0,
                      conventionType.value < 1 ? 'ARC72 NFT' : 'OFFCHAIN Asset',
                      parameterStore.value.seller,
                      null,
                      parameterStore.value.duration,
                      parameterStore.value.priceMin,
                      parameterStore.value.priceMax,
                      10,
                      contractType.value === CONTRACT_TYPE.Dutch ? 'dutch' : 'english'
                    )
                    if (error) {
                        console.error(error)
                    }
                }
            }

            state.value = TRANSACTION_STATE.sendingTransaction
            const confirmation = await walletStore.value.provider.sendRawTransactions(signedTxn)

            state.value = TRANSACTION_STATE.success
            successInfo.value = confirmation
        } catch (error) {
            state.value = TRANSACTION_STATE.error
            errorInfo.value = error as object
        }
    }

    return {
        transactionType,
        contractType,
        conventionType,
        walletStore,
        parameterStore,
        state,
        successInfo,
        errorInfo,
        doTransaction,
        client
    }
})
