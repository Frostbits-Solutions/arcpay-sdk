<template>
<div class="ap-text-center ap-text-gray-700 dark:ap-text-gray-200">
  <div class="ap-border-b ap-mb-8 ap-pb-4 dark:ap-border-gray-700 ap-w-72 ap-m-auto ap-text-center">
    <div class="ap-m-auto ap-w-fit ap-flex ap-items-center ap-relative ap-left-[20px]">
      <img class="ap-w-8 ap-h-8" src="/src/assets/logo.png" >
      <h1 class="ap-ml-2 ap-text-2xl ml-2 dark:text-white">Arcpay</h1>
    </div>
  </div>
  <h2 class="ap-font-bold ap-text-lg ap-mb-4">Account to use</h2>
  <button
    class="ap-flex ap-items-center ap-w-full hover:ap-bg-gray-100 ap-p-2 ap-rounded"
    v-for="account of walletStore.wallet.accounts"
    @click="() => chooseAccount(account)"
    :key="account.address"
  >
    <span>
      <template v-if="account.name">
        <b>{{account.name}}</b>
        <span class="ap-text-gray-500 dark:ap-text-gray-100 ap-text-sm ap-ml-2">
          {{getShortAddress(account.address)}}
        </span>
      </template>
      <template v-else>
        <b>{{getShortAddress(account.address)}}</b>
      </template>
    </span>
    <IconChevronNext class="ap-inline-block ap-ml-auto"/>
  </button>
</div>
</template>

<script setup lang="ts">
import type { Account } from '@/types'
import { onMounted } from 'vue'
import IconChevronNext from '@/components/icons/IconChevronNext.vue'
import {useWalletStore} from "@/stores/walletStore";

const walletStore = useWalletStore()

function getShortAddress (address: string) {
  return `${address.slice(0,10)}...${address.slice(address.length-3)}`
}

function chooseAccount (account: Account) {
  walletStore.$patch({
    account
  })
}

function onMountedHook () {
  if (walletStore?.wallet?.accounts.length === 1) {
    chooseAccount(walletStore.wallet.accounts[0])
  }
}

// @ts-ignore
onMounted(onMountedHook)
</script>

<style scoped>
</style>
