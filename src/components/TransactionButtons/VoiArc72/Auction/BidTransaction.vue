<template>
  <IntInput :min="parameters.minPrice" v-model="price"/>
  <button
    class="arc-pay-transaction-button"
    @click="bid">bid</button>
</template>

<script setup lang="ts">
import IntInput from '@/components/IntInput.vue'
import type { Account, BidTransactionParameters } from '@/types'
import { useWalletStore } from '@/stores/walletStore'
import { Transaction } from '@/transaction'
import _algosdk from 'algosdk'
import { TransactionType } from 'algosdk/src/types/transactions'
import { ref } from 'vue'


const web3Store = useWalletStore()
const props = defineProps<{
  account: Account,
  parameters: BidTransactionParameters
}>()
const emits = defineEmits(['start', 'nextStep', 'done', 'error'])
const price = ref(props.parameters.minPrice)

async function bid() {
  try {
    if (web3Store.provider === null) {
      throw { message: 'no provider initiated' }
    }
    emits('start')
    const algosdk = web3Store.provider.algosdk
    const algodClient = web3Store.provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(props.parameters.appIndex)

    const payObj = {
      type: TransactionType.pay,
      from: props.account.address,
      to: appAddress,
      amount: price.value * 1_000_000,
      suggestedParams
    }

    const appArgs = [new TextEncoder().encode('bid')]
    const appCallObj = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: appArgs,
      suggestedParams,
    }

    const txns = await new Transaction([payObj, appCallObj]).createTxns(algosdk, algodClient)

    const signedTxn = await web3Store.provider.signTransactions(txns, true)
    emits('nextStep')

    const confirmationSendTxn = await web3Store.provider.sendRawTransactions(signedTxn)
    emits('done', confirmationSendTxn)
  }catch (e) {
    emits('error', e)
  }
}

// const boxes: BoxReference[] = [
//   {
//     appIndex: props.parameters.appIndex,
//     name: concatUint8Array(new Uint8Array([110]), encodedElements[3])
//   },
//   {
//     appIndex: props.parameters.appIndex,
//     name: concatUint8Array(encodedElements[1],encodedElements[1])
//   },
//   {
//     appIndex: props.parameters.appIndex,
//     name: concatUint8Array(new Uint8Array([98]), encodedElements[1])
//   },
//   {
//     appIndex: props.parameters.appIndex,
//     name: concatUint8Array(new Uint8Array([98]), encodedElements[2])
//   }
// ]
</script>

<style scoped>
</style>
