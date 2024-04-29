<template>
<div class="ap-text-center ap-text-gray-700 dark:ap-text-gray-200">
  <h2 class="ap-font-bold ap-text-lg">VOI Wallet</h2>
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
