<template>
<div class="ap-text-center ap-text-gray-700 dark:ap-text-gray-200">
  <div class="ap-border-b ap-mb-8 ap-pb-4 dark:ap-border-gray-700 ap-w-72 ap-m-auto ap-text-center">
    <div class="ap-m-auto ap-w-fit ap-flex ap-items-center ap-relative ap-left-[20px]">
      <img class="ap-w-8 ap-h-8" src="/src/assets/logo.png" >
      <h1 class="ap-ml-2 ap-text-2xl ml-2 dark:text-white">Arcpay</h1>
    </div>
  </div>
  <h2 class="ap-font-bold ap-text-lg ap-mb-4">Select a Wallet</h2>
  <div class="ap-mx-auto ap-w-fit">
    <button
      class="ap-flex ap-items-center ap-w-full hover:ap-bg-gray-100 ap-p-2 rounded"
      v-for="provider of providers"
      @click="() => chooseWallet(provider.providerId)"
      :key="provider.name"
    >
      <img
        class="ap-mr-2 ap-w-8 ap-h-8 ap-rounded-full"
        :src="provider.icon">
      {{provider.name}}
      <IconChevronNext class="ap-inline-block ap-ml-auto"/>
    </button>
  </div>
</div>
</template>

<script setup lang="ts">
import {PROVIDER_ID, PROVIDER_ICONS, PROVIDER} from '@/constants'
import IconChevronNext from '@/components/icons/IconChevronNext.vue'
import {useWalletStore} from "@/stores/walletStore";

const emit = defineEmits(['wallet'])

const walletStore = useWalletStore()

const providers =
  Object.values(PROVIDER_ID)
    .map((id) => {
      return {
        providerId: id,
        name: id,
        icon: PROVIDER_ICONS[id]
      }
    }) ;

async function chooseWallet (providerid: PROVIDER_ID) {
  const provider = await PROVIDER[providerid].init()
  const wallet = await provider.connect(() => {})
  if (wallet.accounts.length === 0) {
    throw { message: 'Wallet does not have any accounts'}
  }
  walletStore.$patch({
    wallet,
    provider,
    walletId: providerid
  })
}
</script>

<style scoped>
button {
  border: none;
  background: transparent;
}
</style>
