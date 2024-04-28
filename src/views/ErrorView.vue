<template>
  <div class="border-t pt-8 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200 break-words">
    <IconExclamationCircle class="block m-auto fill-red-600 w-14 h-14"/>
    <h2 class="font-bold text-lg text-red-600 mb-4">Error</h2>
    <template v-if="information.message">
      {{information.message}}
      <p v-id="information.code">
        Error Code: {{information.code}}
      </p>
    </template>
    <template v-else>
      {{information}}
    </template>
  </div>
</template>

<script setup lang="ts">
import IconExclamationCircle from '@/components/icons/IconExclamationCircle.vue'
import {useTransactionStore} from "@/stores/transactionStore";
import {computed} from "vue";

const transactionStore = useTransactionStore()
const information = computed(() =>transactionStore.errorInfo)
</script>

<style scoped>

</style>
