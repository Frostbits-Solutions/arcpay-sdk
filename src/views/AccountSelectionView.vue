<template>
<div class="border-t pt-8 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200">
  <h2 class="font-bold text-lg">Account to use</h2>
  <button
    class="flex items-center w-full hover:bg-gray-100 p-2 rounded"
    v-for="account of accounts"
    @click="() => chooseAccount(account)"
    :key="account.address"
  >
    <span>
      <template v-if="account.name">
        <b>{{account.name}}</b>
        <span class="text-gray-500 dark:text-gray-100 text-sm ml-2">
          {{getShortAddress(account.address)}}
        </span>
      </template>
      <template v-else>
        <b>{{getShortAddress(account.address)}}</b>
      </template>
    </span>
    <IconChevronNext class="inline-block ml-auto"/>
  </button>
</div>
</template>

<script setup lang="ts">
import type { Account } from '@/types'
import { onMounted } from 'vue'
import IconChevronNext from '@/components/icons/IconChevronNext.vue'
import {useWalletStore} from "@/stores/walletStore";

const props = defineProps<{ accounts: Account[]}>()

const walletStore = useWalletStore()
function getShortAddress (address: string) {
  return `${address.slice(0,10)}...${address.slice(address.length-3)}`
}

function chooseAccount (account: Account) {
  walletStore.account = account
}

function onMountedHook () {
  if (props.accounts.length === 1) {
    chooseAccount(props.accounts[0])
  }
}

// @ts-ignore
onMounted(onMountedHook)
</script>

<style scoped>
</style>
