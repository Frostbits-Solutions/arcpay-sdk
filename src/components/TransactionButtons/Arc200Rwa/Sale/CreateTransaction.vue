<template>
  <IntInput v-model="price"/>
  <IntInput v-model="arc200AppID"/>
  <TextInput v-model="name"/>
  <TextInput v-model="description"/>
  <button
    class="arc-pay-transaction-button"
    @click="create">Create</button>
</template>

<script setup lang="ts">
import IntInput from '@/transactions/component/IntInput.vue'

import type { Account, AppCallObject, AppCreateObject, CreateTransactionParameters, PaymentObject } from '@/types'
import { useWeb3Store } from '@/stores/web3'
import { ref } from 'vue'
import { base64ToArrayBuffer, encodeAppArgs, longToByteArray } from '@/transactions/utils'
import { approvalProgram, clearProgram } from './contract'
import { arc72Schema } from '@/transactions/abi/arc72'
import { Transaction } from '@/transactions/transaction'
import _algosdk from 'algosdk'
import { TransactionType } from 'algosdk/src/types/transactions'
import TextInput from '@/transactions/component/TextInput.vue'

const web3Store = useWeb3Store()
const props = defineProps<{
    account: Account,
    parameters: CreateTransactionParameters
  }>()
const emits = defineEmits(['start', 'nextStep', 'done', 'error'])
const price = ref(1)
const name = ref('testName')
const description = ref('testDesc')
const arc200AppID = ref(40427782)

async function create() {
  try {
    if (web3Store.provider === null) {
      throw { message: 'no provider initiated' }
    }
    const algosdk = web3Store.provider.algosdk
    const algodClient = web3Store.provider.algodClient as _algosdk.Algodv2

    emits('start')

    /*** Creation of the application ***/
    const _price = price.value
    const suggestedParams = await algodClient.getTransactionParams().do()
    const appArgs = [
      longToByteArray(_price, 32),
      algosdk.decodeAddress(props.parameters.feesAddress).publicKey,
      new TextEncoder().encode(name.value),
      new TextEncoder().encode(description.value),
      longToByteArray(arc200AppID.value, 8),
      algosdk.decodeAddress(algosdk.getApplicationAddress(arc200AppID.value)).publicKey,
    ]

    const appCreateObj =
      {
        type: TransactionType.appl,
        from: props.account.address,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        suggestedParams,
        appArgs,
        approvalProgram: base64ToArrayBuffer(approvalProgram),
        clearProgram: base64ToArrayBuffer(clearProgram),
        numGlobalInts: 7,
        numGlobalByteSlices: 7,
        numLocalInts: 0,
        numLocalByteSlices: 0,
      } as AppCreateObject

    const txns =
      await new Transaction([appCreateObj])
        .createTxns(algosdk, algodClient)

    const signedTxn = await web3Store.provider.signTransactions(txns, false)
    emits('nextStep')

    const confirmation = await web3Store.provider.sendRawTransactions(signedTxn)
    emits('nextStep')
    // @ts-ignore
    console.log(confirmation, confirmation['application-index'])

    /*** Funding the application ***/
    // @ts-ignore
    const appAddr = algosdk.getApplicationAddress(confirmation['application-index'])
    const suggestedParamsFund = await algodClient.getTransactionParams().do()
    const fundingAmount = 300_000 + 10_000

    const fundAppObj: PaymentObject = {
      type: TransactionType.pay,
      from: props.account.address,
      to: appAddr,
      amount: fundingAmount,
      suggestedParams: suggestedParamsFund,
    }

    const txns2 =
      await new Transaction([fundAppObj])
        .createTxns(algosdk, algodClient)


    const signedFundAppTxn = await web3Store.provider.signTransactions(txns2, true)

    emits('nextStep')

    const confirmationSendFund = await web3Store.provider.sendRawTransactions(signedFundAppTxn)
    emits('done', confirmationSendFund)
  } catch (e) {
    emits('error', e)
  }
}
</script>

<style scoped>
</style>
