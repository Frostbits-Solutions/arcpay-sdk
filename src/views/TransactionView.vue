<script setup lang="ts">
import {PROVIDER_ICONS, TRANSACTIONS_STEPS} from '@/constants'
import {useWalletStore} from "@/stores/walletStore";
import {getShortAddress} from "@/utils";
import IconChevronPrevious from "@/components/icons/IconChevronPrevious.vue";
import TransactionStepsPreview from "@/components/Transaction/TransactionStepsPreview.vue";
import {useTransactionStore} from "@/stores/transactionStore";

const walletStore = useWalletStore()
const transactionStore = useTransactionStore()


function resetAddress () {
  walletStore.$patch({
    account:null
  })
}

function resetWallet () {
  walletStore.$patch({
    wallet: null,
    walletId: null,
    provider: null,
    account:null
  })
}
// const parameterArray = computed(() => {
//   const parameterKeys = [
//     'nftID',
//     'minPrice',
//     'price',
//     'seller',
//     'appIndex',
//     //'nftAppID',
//     //'arc200AppID',
//     'feesAddress',
//   ]
//   const pArray: Array<{key: string, value: string|number}> = []
//   for (const key of parameterKeys) {
//     if (props.parameters[key as keyof TransactionParameters]) {
//       pArray.push(formatParameters(key, props.parameters[key as keyof TransactionParameters]))
//     }
//   }
//
//   return pArray
// })
//
//
// function formatParameters (key: string, value: number|string) {
//   switch (key) {
//     case 'appIndex':
//       return {
//         key: 'Application ID',
//         value: value
//       }
//     case 'nftID':
//       return {
//         key: 'NFT ID',
//         value: value
//       }
//     case 'minPrice':
//       return {
//         key: 'Minimum bid price',
//         value: value
//       }
//     case 'price':
//       return {
//         key: 'Price',
//         value: value
//       }
//     case 'seller':
//       return {
//         key: 'NFT Seller',
//         value:getShortAddress(value as string)
//       }
//     case 'nftAppID':
//       return {
//         key: 'Sold NFT Application ID',
//         value: value
//       }
//     case 'arc200AppID':
//       return {
//         key: 'ARC 200 NFT Application ID',
//         value: value
//       }
//     case 'feesAddress':
//       return {
//         key: 'Fees address',
//         value:getShortAddress(value as string)
//       }
//     default:
//       return {
//         key,
//         value
//       }
//   }
// }
</script>

<template>
  <div class="ap-space-y-6 ap-text-center ap-text-gray-700 dark:ap-text-gray-200 ap-flex ap-flex-col">
    <div class="ap-flex ap-flex-col ap-items-center">
      <img
        class="ap-w-8 ap-h-8 ap-rounded-full ap-justify-self-end"
        :src="PROVIDER_ICONS[walletStore.account.providerId]">
      <div class="ap-text-left ap-self-center">{{getShortAddress(walletStore.account.address)}}</div>
      <!--
      <template v-for="parameter of parameterArray" :key="`parameter-${parameter.key}`" v-if="false">
        <div class="ap-text-right">
          {{parameter.key}}
        </div>
        <div class="ap-text-left">
          {{parameter.value}}
        </div>
      </template>
    -->
    </div>
    <h2 class="ap-font-bold ap-text-lg">Transaction input</h2>
    <router-view/>

    <TransactionStepsPreview v-if="transactionStore.state !== 0"/>

    <div class="ap-flex ap-justify-center ap-gap-2">
      <button
        class="ap-flex ap-grow ap-items-center ap-justify-center ap-py-2.5 ap-px-5 ap-me-2 ap-mb-2 ap-text-sm ap-font-medium ap-text-gray-900 focus:ap-outline-none ap-bg-white ap-rounded-lg ap-border ap-border-gray-200 hover:ap-bg-gray-100 hover:ap-text-blue-700 focus:ap-z-10 focus:ap-ring-4 focus:ap-ring-gray-100 dark:focus:ap-ring-gray-700 dark:ap-bg-gray-800 dark:ap-text-gray-400 dark:ap-border-gray-600 dark:hover:ap-text-white dark:hover:ap-bg-gray-700"
        @click="resetWallet">
        <IconChevronPrevious/> Wallet
      </button>
      <button
        class="ap-flex ap-grow ap-items-center ap-justify-center ap-py-2.5 ap-px-5 ap-me-2 ap-mb-2 ap-text-sm ap-font-medium ap-text-gray-900 focus:ap-outline-none ap-bg-white ap-rounded-lg ap-border ap-border-gray-200 hover:ap-bg-gray-100 hover:ap-text-blue-700 focus:ap-z-10 focus:ap-ring-4 focus:ap-ring-gray-100 dark:focus:ap-ring-gray-700 dark:ap-bg-gray-800 dark:ap-text-gray-400 dark:ap-border-gray-600 dark:hover:ap-text-white dark:hover:ap-bg-gray-700"
        @click="resetAddress"><IconChevronPrevious/> Account</button>
    </div>
  </div>
</template>

<style scoped>

</style>
