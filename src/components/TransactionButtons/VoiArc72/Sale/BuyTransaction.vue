<template>
  <button
    class="arc-pay-transaction-button"
    @click="buy">buy</button>
</template>

<script setup lang="ts">
import type { Account, BuyTransactionParameters } from '@/types'
import { useWalletStore } from '@/stores/walletStore'
import { Transaction } from '@/transaction'
import _algosdk from 'algosdk'
import { TransactionType } from 'algosdk/src/types/transactions'


const web3Store = useWalletStore()
const props = defineProps<{
  account: Account,
  parameters: BuyTransactionParameters
}>()
const emits = defineEmits(['start', 'nextStep', 'done', 'error'])

async function buy() {
  try {
    if (web3Store.provider === null) {
      throw { message: 'no provider initiated' }
    }
    emits('start')
    const algosdk = web3Store.provider.algosdk
    const algodClient = web3Store.provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(props.parameters.appIndex)

    const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
    const preValidateObj = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: preValidateAppArgs,
      accounts: [
        props.parameters.seller,
        props.parameters.feesAddress,
      ],
      foreignApps: [props.parameters.nftAppID],
      suggestedParams: suggestedParams,
    }

    const payObj = {
      type: TransactionType.pay,
      from: props.account.address,
      to: appAddress,
      amount: props.parameters.price * 1_000_000,
      suggestedParams
    }

    const appArgs = [new TextEncoder().encode('buy')]
    const appCallObj = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: appArgs,
      suggestedParams,
    }

    const txns = await new Transaction([preValidateObj, payObj, appCallObj]).createTxns(algosdk, algodClient)

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
