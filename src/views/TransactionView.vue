<script setup lang="ts">

import { PROVIDER_ICONS } from '@/constants'
</script>

<template>
  <div class="space-y-6 border-t pt-8 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200 flex flex-col items-center">
    <h2 class="font-bold text-lg">Transaction overview</h2>
    <div class="grid grid-cols-2 gap-x-3">
      <img
        class="w-8 h-8 rounded-full justify-self-end"
        :src="PROVIDER_ICONS[web3Store.account.providerId]">
      <div class="text-left self-center">{{getShortAddress(web3Store.account.address)}}</div>
      <template v-for="parameter of parameterArray" :key="`parameter-${parameter.key}`">
        <div class="text-right">
          {{parameter.key}}
        </div>
        <div class="text-left">
          {{parameter.value}}
        </div>
      </template>
    </div>
    <h2 class="font-bold text-lg">Transaction input</h2>
    <router-view :parameters="parameters" />

    <TransactionStepsPreview
      :current-step="currentTransactionStep"
      :steps="TRANSACTIONS_STEPS[transactionType]"
      v-if="currentTransactionStep !== null"
    />

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