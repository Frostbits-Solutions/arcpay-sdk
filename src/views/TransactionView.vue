<script setup lang="ts">
import {PROVIDER_ICONS} from '@/constants'
import {useWalletStore} from "@/stores/walletStore";
import {getShortAddress} from "@/utils";
import IconChevronPrevious from "@/components/icons/IconChevronPrevious.vue";

const walletStore = useWalletStore()


function resetAddress () {
  walletStore.account = null
}

function resetWallet () {
  walletStore.walletId = null
  resetAddress()
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
  <div class="space-y-6 border-t pt-8 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200 flex flex-col items-center">
    <h2 class="font-bold text-lg">Transaction overview</h2>
    <div class="grid grid-cols-2 gap-x-3">
      <img
        class="w-8 h-8 rounded-full justify-self-end"
        :src="PROVIDER_ICONS[walletStore.account.providerId]">
      <div class="text-left self-center">{{getShortAddress(walletStore.account.address)}}</div>
      <!--
      <template v-for="parameter of parameterArray" :key="`parameter-${parameter.key}`" v-if="false">
        <div class="text-right">
          {{parameter.key}}
        </div>
        <div class="text-left">
          {{parameter.value}}
        </div>
      </template>
    -->
    </div>
    <h2 class="font-bold text-lg">Transaction input</h2>
    <router-view/>

    <TransactionStepsPreview/>

    <div class="w-full border-t pt-8 dark:border-gray-700 flex justify-between">
      <button
        class="flex items-center justify-center w-[48%] rounded-lg bg-blue-200 px-5 py-2.5 text-center text-sm font-medium hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="resetWallet">
        <IconChevronPrevious/> Wallet
      </button>
      <button
        class="flex items-center justify-center w-[48%] rounded-lg bg-blue-200 px-5 py-2.5 text-center text-sm font-medium hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="resetAddress"><IconChevronPrevious/> Account</button>
    </div>
  </div>
</template>

<style scoped>

</style>
