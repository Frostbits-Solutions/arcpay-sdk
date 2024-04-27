<template>
<div class="border-t pt-8 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200">
  <h2 class="font-bold text-lg">VOI Wallet</h2>
  <div class="mx-auto w-fit">
    <button
      class="flex items-center w-full hover:bg-gray-100 p-2 rounded"
      v-for="provider of providers"
      @click="() => chooseWallet(provider.providerId)"
      :key="provider.name"
    >
      <img
        class="mr-2 w-8 h-8 rounded-full"
        :src="provider.icon">
      {{provider.name}}
      <IconChevronNext class="inline-block ml-auto"/>
    </button>
  </div>
</div>
</template>

<script setup lang="ts">
import { PROVIDER_ID, PROVIDER_ICONS } from '@/constants'
import { onMounted } from 'vue'
import IconChevronNext from '@/components/icons/IconChevronNext.vue'

const emit = defineEmits(['wallet'])

const providers =
  Object.values(PROVIDER_ID)
    .map((id) => {
      return {
        providerId: id,
        name: id,
        icon: PROVIDER_ICONS[id]
      }
    }) ;

function chooseWallet (wallet: string) {
  emit('wallet', wallet)
}
</script>

<style scoped>
button {
  border: none;
  background: transparent;
}
</style>
