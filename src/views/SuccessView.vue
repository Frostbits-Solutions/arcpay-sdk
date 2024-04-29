ap-<template>
<div class="ap-space-y-6 ap-pt-8 ap-text-center ap-text-gray-700 dark:ap-text-gray-200">
  <IconCheckCircle class="ap-block ap-m-auto ap-fill-green-500 ap-w-14 ap-h-14 ap-mb-4"/>
  Tx id: <span class="ap-break-words">{{information.txId}}</span><br>
  Confirmed round: {{information['confirmed-round']}}<br>
  <a :href="`https://voi.observer/explorer/transaction/${information.txId}`">VOI explorer <IconArrowRightCorner class="ap-inline-block ap-w-4 ap-h-4"/></a>
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
