<template>
  <button
    class="arc-pay-transaction-button"
    @click="buy">buy</button>
</template>

<script setup lang="ts">
import type { Account, BuyWArc200TransactionParameters, AppCallObject } from '@/types'
import { useWalletStore } from '@/stores/walletStore'
import { Transaction } from '@/transaction'
import _algosdk from 'algosdk'
import { TransactionType } from 'algosdk/src/types/transactions'
import arc200Schema from '@/lib/contracts/abi/arc200'
import { encodeAppArgs, longToByteArray } from '@/utils'


const web3Store = useWalletStore()
const props = defineProps<{
  account: Account,
  parameters: BuyWArc200TransactionParameters
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

    const abi = new algosdk.ABIContract(arc200Schema)
    const abiMethod = abi.getMethodByName('arc200_transfer')
    const args = [appAddress, props.parameters.price]
    const arc200AppArgs = encodeAppArgs(abiMethod, args)


    const fundArc200Obj = {
      type: TransactionType.pay,
      from: props.account.address,
      to: algosdk.getApplicationAddress(props.parameters.arc200AppID),
      amount: 28500,
      suggestedParams
    }

    const arc200ApproveObj: AppCallObject = {
      type: TransactionType.appl,
      suggestedParams: suggestedParams,
      from: props.account.address,
      appIndex: props.parameters.arc200AppID,
      appArgs: arc200AppArgs,
      foreignApps: [props.parameters.arc200AppID],
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
    }

    const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
    const preValidateObj: AppCallObject = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: preValidateAppArgs,
      accounts: [
        props.parameters.seller,
        props.parameters.feesAddress,
      ],
      foreignApps: [props.parameters.nftAppID, props.parameters.arc200AppID, props.parameters.appIndex],
      suggestedParams: suggestedParams,
    }

    const appArgs = [
      new TextEncoder().encode('buy'),
      longToByteArray(props.parameters.price, 8),
    ]
    const appCallObj: AppCallObject = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: appArgs,
      suggestedParams,
    }

    const txns = await new Transaction([fundArc200Obj, arc200ApproveObj, preValidateObj, appCallObj]).createTxns(algosdk, algodClient)

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
