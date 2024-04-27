<template>
<div class="space-y-6 border-t pt-8 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200">
  <IconCheckCircle class="block m-auto fill-green-500 w-14 h-14 mb-4"/>
  Tx id: <span class="break-words">{{information.txId}}</span><br>
  Confirmed round: {{information['confirmed-round']}}<br>
  <a :href="`https://voi.observer/explorer/transaction/${information.txId}`">VOI explorer <IconArrowRightCorner class="inline-block w-4 h-4"/></a>
</div>
</template>

<script setup lang="ts">

import IconCheckCircle from '@/components/icons/IconCheckCircle.vue'
import IconArrowRightCorner from '@/components/icons/IconArrowRightCorner.vue'

defineProps < {
  information: object
 } > ()

</script>

<style scoped>

</style>
