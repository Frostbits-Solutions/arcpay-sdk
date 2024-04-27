<template>
  <button
    class="arc-pay-transaction-button"
    @click="cancel">Cancel</button>
</template>

<script setup lang="ts">
import { useWeb3Store } from '@/stores/web3'
import type { Account, AppCallObject, AppDeleteObject, CancelTransactionParameters } from '@/types'
import { Transaction } from '@/transactions/transaction'
import _algosdk from 'algosdk'
import { TransactionType } from 'algosdk/src'

const web3Store = useWeb3Store()
const props = defineProps<{
  account: Account,
  parameters: CancelTransactionParameters
}>()
const emits = defineEmits(['start', 'nextStep', 'done', 'error'])
async function cancel() {
  try {
    if (web3Store.provider === null) {
      throw { message: 'no provider initiated' }
    }
    emits('start')
    const algosdk = web3Store.provider.algosdk
    const algodClient = web3Store.provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const accounts = [
      props.parameters.seller,
    ]
    const foreignApps = [props.parameters.appIndex, props.parameters.nftAppID]

    const appArgs = [new TextEncoder().encode('cancel')]
    const appCallObj: AppDeleteObject = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
      accounts,
      appArgs,
      foreignApps,
      suggestedParams
    }

    const txns = await new Transaction([appCallObj]).createTxns(algosdk, algodClient)

    const signedTxn = await web3Store.provider.signTransactions(txns, false)
    emits('nextStep')

    const confirmationSendTxn = await web3Store.provider.sendRawTransactions(signedTxn)
    emits('done', confirmationSendTxn)
  } catch (e) {
    emits('error', e)
  }
}
</script>

<style scoped>
</style>
