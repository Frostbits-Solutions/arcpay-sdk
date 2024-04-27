<template>
  <button
    class="arc-pay-transaction-button"
    @click="buy">buy</button>
</template>

<script setup lang="ts">
/***
 * ARC 200 -> ARC 72
 * ***/
import type { Account, BuyWArc200TransactionParameters, AppCallObject } from '@/types'
import { useWeb3Store } from '@/stores/web3'
import { Transaction } from '@/transactions/transaction'
import _algosdk, { AtomicTransactionComposer } from 'algosdk'
import { TransactionType } from 'algosdk/src/types/transactions'
import { encodeAppArgs, fromHexString, toHexString } from '@/transactions/utils'
import arc200Schema from '@/transactions/abi/arc200'


const web3Store = useWeb3Store()
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

    const appArgs = [new TextEncoder().encode('buy')]
    const appCallObj: AppCallObject = {
      type: TransactionType.appl,
      from: props.account.address,
      appIndex: props.parameters.appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: appArgs,
      suggestedParams,
    }
//[arc200ApproveObj, preValidateObj, appCallObj]
    const txns = await new Transaction([
      fundArc200Obj,
      arc200ApproveObj,
      preValidateObj,
      appCallObj
    ]).createTxns(algosdk, algodClient)

    const signedTxn = await web3Store.provider.signTransactions(txns, true)
    emits('nextStep')

    const confirmationSendTxn = await web3Store.provider.sendRawTransactions(signedTxn)
    emits('done', confirmationSendTxn)
  }catch (e) {
    emits('error', e)
  }
}
</script>

<style scoped>
</style>
