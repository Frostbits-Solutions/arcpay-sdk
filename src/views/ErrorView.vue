<template>
  <div class="ap-border-t ap-pt-8 dark:ap-border-gray-700 ap-text-center ap-text-gray-700 dark:ap-text-gray-200 ap-break-words">
    <IconExclamationCircle class="ap-block ap-m-auto ap-fill-red-600 ap-w-14 ap-h-14"/>
    <h2 class="ap-font-bold ap-text-lg ap-text-red-600 ap-mb-4">Error</h2>
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
