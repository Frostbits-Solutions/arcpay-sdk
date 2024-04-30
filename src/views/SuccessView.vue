ap-<template>
<div class="ap-space-y-6 ap-text-center ap-text-gray-700 dark:ap-text-gray-200">
  <div class="ap-border-b ap-mb-8 ap-pb-4 dark:ap-border-gray-700 ap-w-72 ap-m-auto ap-text-center">
    <div class="ap-m-auto ap-w-fit ap-flex ap-items-center ap-relative ap-left-[20px]">
      <img class="ap-w-8 ap-h-8" src="/src/assets/logo.png" >
      <h1 class="ap-ml-2 ap-text-2xl ml-2 dark:text-white">Arcpay</h1>
    </div>
  </div>
  <IconCheckCircle class="ap-block ap-m-auto ap-fill-green-500 ap-w-14 ap-h-14 ap-mb-4"/>
  Confirmed round: {{information['confirmed-round']}}
  <br>
  <a :href="`https://voi.observer/explorer/transaction/${information.txId}`">VOI explorer <IconArrowRightCorner class="ap-inline-block ap-w-4 ap-h-4"/></a>
  <div class="ap-truncate ap-text-xs ap-text-gray-400 dark:ap-text-gray-700">Tx id: {{information.txId}}</div>

</div>
</template>

<script setup lang="ts">

import IconCheckCircle from '@/components/icons/IconCheckCircle.vue'
import IconArrowRightCorner from '@/components/icons/IconArrowRightCorner.vue'
import {useTransactionStore} from "@/stores/transactionStore";
import {computed} from "vue";

const transactionStore = useTransactionStore()
const information = computed(() =>transactionStore.successInfo)
</script>

<style scoped>

</style>
